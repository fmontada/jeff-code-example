package app

import (
	"context"
	"encoding/json"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/sns"
	"github.com/aws/aws-sdk-go-v2/service/sns/types"
	"github.com/gap-commerce/srv-emberz/pkg/auth"
	"github.com/gap-commerce/srv-emberz/pkg/erp/blaze"
	"github.com/gap-commerce/srv-emberz/pkg/model"
	"github.com/gap-commerce/srv-emberz/pkg/pagination"
	"github.com/gap-commerce/srv-emberz/pkg/scalar"
	"github.com/gap-commerce/srv-emberz/pkg/services/order"
	"github.com/go-resty/resty/v2"
	"github.com/google/uuid"
)

func (a *App) UpdateCart(
	ctx context.Context,
	accountID,
	storeID string,
	order *model.Order,
	cd *model.ClientDetail,
) (*model.Order, error) {
	// get store
	storeKey := a.GetResourceKey(accountID, storeID, a.Config.StoreKey)
	st, err := a.Services.Store.Get(ctx, storeKey)
	if err != nil {
		return nil, err
	}

	if order.EntityID == nil || *order.EntityID == "" {
		id := uuid.New().String()
		order.EntityID = &id
		ky := "d#"
		order.Key = &ky
	}

	t := scalar.Timestamp(time.Now().UTC().Unix())
	order.CreatedAt = &t
	order.UpdatedAt = &t
	status := model.OrderStatusTypeAbandonedCart
	order.Status = &status
	order.ClientDetail = cd

	// calculate order price summary
	pKey := a.GetResourceKey(
		accountID,
		storeID,
		a.Config.PromotionKey,
	)

	promotions, err := a.Services.Promotion.GetActives(ctx, pKey)
	if err != nil {
		return nil, err
	}

	a.calculateOrderPrice(ctx, order, *st, promotions, accountID, storeID)

	return a.
		Services.
		Order.
		Upsert(
			ctx,
			*st.DynamoOrderTableName,
			*order,
		)
}

func (a *App) UpdateJaneCart(
	ctx context.Context,
	accountID,
	storeID string,
	order *model.Order,
	cd *model.ClientDetail,
) (*model.Order, error) {
	// get store
	storeKey := a.GetResourceKey(accountID, storeID, a.Config.StoreKey)
	st, err := a.Services.Store.Get(ctx, storeKey)
	if err != nil {
		return nil, err
	}

	if order.EntityID == nil || *order.EntityID == "" {
		id := uuid.New().String()
		order.EntityID = &id
		ky := "d#"
		order.Key = &ky
	}

	t := scalar.Timestamp(time.Now().UTC().Unix())
	order.CreatedAt = &t
	order.UpdatedAt = &t
	status := model.OrderStatusTypeAbandonedCart
	order.Status = &status
	order.ClientDetail = cd

	return a.
		Services.
		Order.
		Upsert(
			ctx,
			*st.DynamoOrderTableName,
			*order,
		)
}

func (a *App) SubmitCart(ctx context.Context, accountID, storeID string, entityID string) error {
	payload := OrderSNSPayload{
		AccountID: accountID,
		StoreID:   storeID,
		EntityID:  entityID,
	}

	d, err := json.MarshalIndent(payload, "", "\t")
	if err != nil {
		return err
	}

	params := &sns.PublishInput{
		Message: aws.String(string(d)),
		MessageAttributes: map[string]types.MessageAttributeValue{
			"event_type": {
				DataType:    aws.String("String"),
				StringValue: aws.String("order/completed"),
			},
			"publisher": {
				DataType:    aws.String("String"),
				StringValue: aws.String("gapcommerce"),
			},
		},
		Subject:  aws.String("order complete"),
		TopicArn: aws.String(a.Config.TopicArn),
	}

	_, err = a.Services.SNS.Publish(ctx, params)
	if err != nil {
		return err
	}

	return nil
}

func (a *App) CustomerOrderHistory(
	ctx context.Context,
	accountID string,
	storeID string,
	cursor *string,
	email string,
	totalPrice *int,
) (*model.OrderCursorPagination, error) {
	storeKey := a.GetResourceKey(accountID, storeID, a.Config.StoreKey)
	store, err := a.Services.Store.Get(ctx, storeKey)
	if err != nil {
		return nil, err
	}

	filter := &order.Filter{
		Cursor:     cursor,
		TotalPrice: totalPrice,
	}

	user := auth.GetUserFromCtx(ctx)

	orders, cn, err := a.
		Services.
		Order.
		GetOrdersByEmail(
			ctx,
			*store.DynamoOrderTableName,
			user.Email,
			filter,
		)
	if err != nil {
		return nil, err
	}

	ords := make([]*model.Order, 0, len(orders))

	for i, _ := range orders {
		ords = append(ords, &orders[i])
	}

	return &model.OrderCursorPagination{
		Cursor: cn,
		Orders: ords,
	}, nil
}

func (a *App) ListStoreOrders(ctx context.Context, accountID string, storeID string, cursor *string, after *string, before *string,
	first *int, last *int, query string) (*model.OrderConnection, error) {
	storeKey := a.GetResourceKey(accountID, storeID, a.Config.StoreKey)
	store, err := a.Services.Store.Get(ctx, storeKey)
	if err != nil {
		return nil, err
	}

	return a.
		Services.
		Order.
		Search(ctx, *store.DynamoOrderTableName, query, pagination.Pagination{
			After:  after,
			Before: before,
			First:  first,
			Last:   last,
		})
}

func (a *App) GetOrder(ctx context.Context,
	accountID string,
	storeID string,
	entityID string,
) (*model.Order, error) {
	storeKey := a.GetResourceKey(accountID, storeID, a.Config.StoreKey)
	store, err := a.Services.Store.Get(ctx, storeKey)
	if err != nil {
		return nil, err
	}
	user := auth.GetUserFromCtx(ctx)

	o, err := a.Services.Order.GetOrderByID(ctx, *store.DynamoOrderTableName, entityID)
	if err != nil {
		return nil, err
	}

	// check if user is superadmin
	for _, role := range user.Roles {
		if role == string(model.RoleSuperAdmin) || role == string(model.RoleAdmin) {
			return o, err
		}
	}

	if *o.Email != user.Email {
		return nil, nil
	}
	return o, err
}

func (a *App) calculateOrderPrice(ctx context.Context, order *model.Order, store model.Store,
	promotions []model.Promotion, accountID string, storeID string) {
	var bSrv blaze.Blaze

	appKey := a.GetResourceKey(
		accountID,
		storeID,
		a.Config.AppKey,
	)

	blazeApp, _ := a.Services.App.GetByHandler(ctx,
		appKey, "blaze")

	if blazeApp != nil {
		bApp := (*blazeApp).(model.Blaze)

		partnerKey := bApp.PartnerKey
		authKey := bApp.AuthKey
		sandbox := false

		if bApp.Sandbox != nil && *bApp.Sandbox {
			partnerKey = bApp.DevPartnerKey
			authKey = bApp.DevAuthKey
			sandbox = true
		}

		rst := resty.New()

		bSrv = blaze.NewService(rst, blaze.Config{
			PartnerKey: *partnerKey,
			AuthKey:    *authKey,
			Sandbox:    sandbox,
		})
	}

	// calculate subtotal
	subtotalPrice := 0
	for _, l := range order.LineItems {
		vSum := 0
		for _, v := range l.Variants {
			vSum += *v.Price
		}

		subtotalPrice += vSum * *l.Quantity
	}

	order.SubtotalPrice = &subtotalPrice
	order.TotalLineItemsPrice = order.SubtotalPrice

	// tax
	totalTax := 0
	if *store.TaxActive {
		switch *store.TaxType {
		case model.TaxTypePercentage:
			totalTax = *order.SubtotalPrice * *store.TaxAmmont / 100
		case model.TaxTypeFlatRate:
			totalTax = *store.TaxAmmont
		}
	}
	order.TotalTax = &totalTax

	totalDiscount := 0
	totalDelivery := 0

	// Every time we call the updateCart we remove
	// the AUTOMATICALLY promotion type from the order
	// and re-apply the logic
	if len(order.DiscountItems) > 0 {
		if *order.DiscountItems[0].DiscountApplyType == model.DiscountApplyTypeAutomatically {
			order.DiscountItems = []*model.OrderDiscountItem{}
		}
	}

	if len(order.DiscountItems) > 0 {
		totalDiscount = a.calculatePromotionRate(model.Promotion{
			DiscountRateType: order.DiscountItems[0].DiscountRateType,
			Rate:             order.DiscountItems[0].Rate,
		}, order)
	}

	if len(order.DiscountItems) == 0 && bSrv != nil {
		for _, promotion := range promotions {
			// this is the default email address
			if *order.Email == "enter_your@address.com" {
				continue
			}

			if promotion.FirstTimePatient == nil || !*promotion.FirstTimePatient {
				continue
			}

			user, _ := bSrv.FindUser(ctx, *order.Email, nil, nil)
			if user == nil {
				totalDiscount = a.calculatePromotionRate(promotion, order)

				item := &model.OrderDiscountItem{
					ID:                promotion.ID,
					DiscountType:      promotion.DiscountType,
					DiscountRateType:  promotion.DiscountRateType,
					DiscountApplyType: promotion.DiscountApplyType,
					Rate:              promotion.Rate,
					BlazeID:           promotion.BlazeID,
				}
				order.DiscountItems = append(order.DiscountItems, item)
				break
			}

		}
	}

	order.TotalDiscounts = &totalDiscount
	order.TotalDelivery = &totalDelivery

	totalPrice :=
		*order.SubtotalPrice +
			*order.TotalDelivery +
			*order.TotalTax -
			*order.TotalDiscounts

	order.TotalPrice = &totalPrice
}

func (a *App) calculatePromotionRate(promotion model.Promotion, order *model.Order) int {
	if *promotion.DiscountRateType == model.DiscountRateTypeAmount {
		return *promotion.Rate
	}

	return *order.SubtotalPrice * *promotion.Rate / 100
}
