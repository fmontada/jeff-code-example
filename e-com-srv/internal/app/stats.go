package app

import (
	"context"
	"fmt"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
	"github.com/gap-commerce/srv-emberz/pkg/model"
	"github.com/gap-commerce/srv-emberz/pkg/scalar"
	"math"
	"sort"
	"strconv"
	"time"
)

func (a *App) GetStats(ctx context.Context, accountID string, storeID string) (*model.Stats, error) {
	storeKey := a.GetResourceKey(accountID, storeID, a.Config.StoreKey)
	store, err := a.Services.Store.Get(ctx, storeKey)
	if err != nil {
		a.Logger.Error(err)
		return nil, err
	}

	source, err := a.source(ctx, *store.DynamoOrderTableName)
	if err != nil {
		a.Logger.Error(err)
		return nil, err
	}

	var orders []SourceData
	for i := range source {
		if *source[i].Key == "d#" {
			orders = append(orders, source[i])
		}
	}

	var customers []SourceData
	for i := range source {
		if *source[i].Key == "c#" {
			customers = append(customers, source[i])
		}
	}

	// -----------------------------------
	// this month total sales report view
	// ------------------------------
	stats := &model.Stats{}
	v := map[int]*model.StatDaily{}
	for i := 1; i <= 12; i++ {
		v[i] = &model.StatDaily{
			Month:    aws.String(a.monthToStr(i)),
			Subtotal: aws.Int(0),
			Total:    aws.Int(0),
		}
	}

	for i := range orders {
		t := time.Unix(int64(*orders[i].CreatedAt), 0)
		if t.Year() == time.Now().Year() {
			d, _ := v[int(t.Month())]
			d.Total = aws.Int(*d.Total + *orders[i].TotalPrice)
			d.Subtotal = aws.Int(*d.Subtotal + *orders[i].SubtotalPrice)
		}
	}

	var annualReport []*model.StatDaily
	for _, value := range v {
		annualReport = append(annualReport, value)
	}

	sort.Slice(annualReport, func(i, j int) bool {
		v1, _ := strconv.Atoi(*annualReport[i].Month)
		v2, _ := strconv.Atoi(*annualReport[j].Month)
		return v1 < v2
	})

	stats.Anual = annualReport

	//------------------------------
	// sales snapshot view
	//------------------------
	labels := a.labels(0) // Get the labels for today day
	stats.Snapshot = &model.StatSnapShot{
		Labels:   labels,
		Subtotal: make([]*int, len(labels)),
		Total:    make([]*int, len(labels)),
	}

	labelIndex := map[string]int{}
	for i := range labels {
		labelIndex[*labels[i]] = i
	}

	for i := range orders {
		index, ok := labelIndex[time.Unix(int64(*orders[i].CreatedAt), 0).Format("02-01-2006")]
		if ok {
			if stats.Snapshot.Subtotal[index] == nil {
				stats.Snapshot.Subtotal[index] = aws.Int(int(0))
			}
			if stats.Snapshot.Total[index] == nil {
				stats.Snapshot.Total[index] = aws.Int(int(0))
			}
			stats.Snapshot.Subtotal[index] = aws.Int(*stats.Snapshot.Subtotal[index] + *orders[i].SubtotalPrice)
			stats.Snapshot.Total[index] = aws.Int(*stats.Snapshot.Total[index] + *orders[i].TotalPrice)
		}
	}

	// -----------------------------------
	// growth report view
	// ------------------------------
	stats.Growth = []*model.GrowthStat{}
	thisMonthTotalOrders := 0
	lastMonthTotalOrders := 0
	thisMonthTotal := 0
	thisMonthSubtotal := 0
	lastMonthTotal := 0
	lastMonthSubtotal := 0
	thisMonthTotalCustomers := 0
	lastMonthTotalCustomers := 0

	t := time.Now()
	firstDayOfTheCurrentMonth := time.Date(t.Year(), t.Month(), 1, 0, 0, 0, 0, time.UTC)
	firstDayOfTheBeforeMonth := time.Date(t.Year(), t.Month()-1, 1, 0, 0, 0, 0, time.UTC)
	for i := range orders {
		if *orders[i].CreatedAt > scalar.Timestamp(firstDayOfTheCurrentMonth.Unix()) {
			thisMonthTotalOrders++
			thisMonthTotal += *orders[i].TotalPrice
			thisMonthSubtotal += *orders[i].SubtotalPrice
			continue
		}

		if *orders[i].CreatedAt > scalar.Timestamp(firstDayOfTheBeforeMonth.Unix()) &&
			*orders[i].CreatedAt < scalar.Timestamp(firstDayOfTheCurrentMonth.Unix()) {
			lastMonthTotalOrders++
			lastMonthTotal += *orders[i].TotalPrice
			lastMonthSubtotal += *orders[i].SubtotalPrice
		}
	}

	for i := range customers {
		if *customers[i].CreatedAt > scalar.Timestamp(firstDayOfTheCurrentMonth.Unix()) {
			thisMonthTotalCustomers++
			continue
		}
		if *customers[i].CreatedAt > scalar.Timestamp(firstDayOfTheBeforeMonth.Unix()) &&
			*customers[i].CreatedAt < scalar.Timestamp(firstDayOfTheCurrentMonth.Unix()) {
			lastMonthTotalCustomers++
		}
	}

	report := []string{"CUSTOMER", "ORDER", "REVENUE", "GROWTH", "AVERAGE_ORDER_SUBTOTAL", "AVERAGE_ORDER_TOTAL"}
	for i := range report {
		s := &model.GrowthStat{
			Type:       aws.String(report[i]),
			Total:      aws.Int(0),
			Percentage: aws.Float64(0),
			Revenue:    aws.Int(0),
		}

		switch report[i] {
		case "CUSTOMER":
			s.Total = &thisMonthTotalCustomers
			s.Percentage = aws.Float64(a.growth(thisMonthTotalCustomers, lastMonthTotalCustomers))
			break
		case "ORDER":
			s.Total = &thisMonthTotalOrders
			s.Percentage = aws.Float64(a.percentage(thisMonthTotalOrders, lastMonthTotalOrders))
			break
		case "REVENUE":
			s.Revenue = &thisMonthTotal
			s.Percentage = aws.Float64(a.percentage(thisMonthTotal, lastMonthTotal))
			break
		case "GROWTH":
			s.Revenue = aws.Int(thisMonthTotal - lastMonthTotal)
			s.Percentage = aws.Float64(a.growth(thisMonthTotal, lastMonthTotal))
			break
		case "AVERAGE_ORDER_SUBTOTAL":
			s.Revenue = aws.Int(thisMonthSubtotal)
			if lastMonthSubtotal > 0 {
				s.Revenue = aws.Int(thisMonthSubtotal / lastMonthSubtotal)
			}
			s.Percentage = aws.Float64(a.percentage(thisMonthSubtotal, lastMonthSubtotal))
			break
		case "AVERAGE_ORDER_TOTAL":
			s.Revenue = aws.Int(thisMonthTotal)
			if lastMonthTotal > 0 {
				s.Revenue = aws.Int(thisMonthTotal / lastMonthTotal)
			}
			s.Percentage = aws.Float64(a.percentage(thisMonthTotal, lastMonthTotal))
			break
		}
		stats.Growth = append(stats.Growth, s)
	}

	//------------------------------
	// top 5 selling products
	//------------------------
	m := map[string]*model.TopProductStat{}
	for i := range orders {
		if *orders[i].CreatedAt > scalar.Timestamp(firstDayOfTheCurrentMonth.Unix()) {
			for j := range orders[i].LineItems {
				item := *orders[i].LineItems[j]
				q, ok := m[*item.ID]
				if ok {
					q.Qty = aws.Int(*q.Qty + *item.Quantity)
					continue
				}

				m[*item.ID] = &model.TopProductStat{
					ID:        item.ID,
					Title:     item.Name,
					Qty:       item.Quantity,
					Price:     item.Price,
					Weight:    aws.Float64(0),
					Thumbnail: item.Thumbnail,
				}
			}
		}
	}

	var topSellingProducts []*model.TopProductStat
	for _, value := range m {
		topSellingProducts = append(topSellingProducts, value)
	}

	sort.Slice(topSellingProducts, func(i, j int) bool {
		return *topSellingProducts[i].Qty > *topSellingProducts[j].Qty
	})

	stats.TopProducts = topSellingProducts
	if len(topSellingProducts) > 5 {
		stats.TopProducts = topSellingProducts[0:5]
	}
	return stats, nil
}

func (a *App) GetSnapshot(ctx context.Context, accountID string, storeID string, option int) (*model.StatSnapShot, error) {
	storeKey := a.GetResourceKey(accountID, storeID, a.Config.StoreKey)
	store, err := a.Services.Store.Get(ctx, storeKey)
	if err != nil {
		a.Logger.Error(err)
		return nil, err
	}

	source, err := a.source(ctx, *store.DynamoOrderTableName)
	if err != nil {
		a.Logger.Error(err)
		return nil, err
	}

	var orders []SourceData
	for i := range source {
		if *source[i].Key == "d#" {
			orders = append(orders, source[i])
		}
	}

	labels := a.labels(option)
	out := &model.StatSnapShot{
		Labels:   labels,
		Subtotal: make([]*int, len(labels)),
		Total:    make([]*int, len(labels)),
	}

	labelIndex := map[string]int{}
	for i := range labels {
		labelIndex[*labels[i]] = i
	}

	for i := range orders {
		index, ok := labelIndex[time.Unix(int64(*orders[i].CreatedAt), 0).Format("02-01-2006")]
		if ok {
			if out.Subtotal[index] == nil {
				out.Subtotal[index] = aws.Int(int(0))
			}
			if out.Total[index] == nil {
				out.Total[index] = aws.Int(int(0))
			}
			out.Subtotal[index] = aws.Int(*out.Subtotal[index] + *orders[i].SubtotalPrice)
			out.Total[index] = aws.Int(*out.Total[index] + *orders[i].TotalPrice)
		}
	}

	return out, nil
}

func (a *App) source(ctx context.Context, tableName string) ([]SourceData, error) {
	startDate := time.Date(time.Now().Year(), time.January, 1, 0, 0, 0, 0, time.UTC)

	if time.Now().Month() == time.January {
		t := time.Now()
		startDate = time.Date(t.Year()-1, time.December, 1, 0, 0, 0, 0, time.UTC)
	}

	endDate := startDate.AddDate(1, 0, 0)

	params := &dynamodb.ScanInput{
		TableName:        aws.String(tableName),
		FilterExpression: aws.String("(created_at BETWEEN :t1 AND :t2) AND (#key = :customer_key OR #key = :order_key) AND #st <> :abandoned_cart"),
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":t1": &types.AttributeValueMemberN{
				Value: fmt.Sprintf("%d", startDate.Unix()),
			},
			":t2": &types.AttributeValueMemberN{
				Value: fmt.Sprintf("%d", endDate.Unix()),
			},
			":customer_key": &types.AttributeValueMemberS{
				Value: "c#",
			},
			":order_key": &types.AttributeValueMemberS{
				Value: "d#",
			},
			":abandoned_cart": &types.AttributeValueMemberS{
				Value: string(model.OrderStatusTypeAbandonedCart),
			},
		},
		ExpressionAttributeNames: map[string]string{
			"#key": "key",
			"#st":  "status",
		},
	}

	var lastEvaluatedKey map[string]types.AttributeValue
	var data []SourceData

	for {
		params.ExclusiveStartKey = lastEvaluatedKey
		r, err := a.Services.DynamoDB.Scan(ctx, params)
		if err != nil {
			return nil, err
		}

		var s []SourceData
		err = attributevalue.UnmarshalListOfMaps(r.Items, &s)
		if err != nil {
			return nil, err
		}

		data = append(data, s...)
		lastEvaluatedKey = r.LastEvaluatedKey
		if lastEvaluatedKey == nil {
			break
		}
	}
	return data, nil
}

func (a *App) monthToStr(m int) string {
	return map[int]string{1: "01", 2: "02", 3: "03", 4: "04", 5: "05", 6: "06", 7: "07", 8: "08", 9: "09", 10: "10", 11: "11", 12: "12"}[m]
}

func (a *App) growth(currentTotal int, previousTotal int) float64 {
	if previousTotal == 0 {
		return float64(100)
	}

	if currentTotal == 0 && previousTotal == 0 {
		return float64(0)
	}

	if previousTotal > 0 {
		return math.Round(
			(math.Sqrt(float64(currentTotal)/float64(previousTotal)) - 1) * 100,
		) // round to nearest
	}

	return float64(0)
}

func (a *App) percentage(currentTotal int, previousTotal int) float64 {
	if previousTotal == 0 {
		return float64(100)
	}

	if currentTotal == 0 && previousTotal == 0 {
		return float64(0)
	}

	if previousTotal > 0 {
		return math.Round(
			(float64(currentTotal) - float64(previousTotal)) / float64(previousTotal) * 100,
		) // round to nearest
	}

	return float64(0)
}

// The labels return the list of dates formatted as "02-01-2006" for a given option value
// allowed options values
// 0 - Today
// 1 - Yesterday
// 2 - This week
// 3 - Last 7 days
// 4 - Last 14 days
// 5 - Last 30 days
// 6 - This month
// 7 - Last month
func (a *App) labels(v int) []*string {
	if v < 0 || v > 7 {
		return nil
	}

	l := "02-01-2006"
	now := time.Now()

	last := func(n int) []*string {
		var days []*string
		c := 0
		for c != n {
			days = append(days, aws.String(now.Format(l)))
			now = now.AddDate(0, 0, -1)
			c++
		}
		return days
	}

	switch v {
	case 0: // Today
		return []*string{aws.String(now.Format(l))}
	case 1: // Yesterday
		return []*string{aws.String(now.AddDate(0, 0, -1).Format(l))}
	case 2: // This week
		if now.Weekday() == time.Monday {
			return []*string{aws.String(now.Format(l))}
		}

		var days []*string
		for now.Weekday() != time.Monday {
			days = append(days, aws.String(now.Format(l)))
			now = now.AddDate(0, 0, -1)
		}

		// add monday
		days = append(days, aws.String(now.Format(l)))
		return days
	case 3: // Last 7 days
		return last(7)
	case 4: // Last 14 days
		return last(14)
	case 5: // Last 14 days
		return last(30)
	case 6: // Last 14 days
		return last(30)
	case 7: // Last 14 days
		return last(30)
	}

	return nil
}
