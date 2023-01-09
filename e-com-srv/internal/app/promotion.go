package app

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"io/ioutil"
	"sync"
	"time"

	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/gap-commerce/srv-emberz/pkg/ecommerce/jane"
	"github.com/gap-commerce/srv-emberz/pkg/model"
	"github.com/go-resty/resty/v2"
	"golang.org/x/sync/errgroup"
)

func (a *App) ApplyPromotionCode(ctx context.Context, accountID string,
	storeID string,
	orderID string,
	promoCode string) (*model.OrderDiscountItem, error) {

	pKey := a.GetResourceKey(
		accountID,
		storeID,
		a.Config.PromotionKey,
	)

	promotions, err := a.Services.Promotion.GetActives(ctx, pKey)
	if err != nil {
		a.Logger.Error(err)
		return nil, err
	}

	for _, promotion := range promotions {
		if promotion.DiscountApplyType != nil &&
			*promotion.DiscountApplyType == model.DiscountApplyTypePromotionCode &&
			promotion.PromoCode != nil && *promotion.PromoCode == promoCode {

			return &model.OrderDiscountItem{
				ID:                promotion.ID,
				DiscountType:      promotion.DiscountType,
				DiscountRateType:  promotion.DiscountRateType,
				DiscountApplyType: promotion.DiscountApplyType,
				PromoCode:         promotion.PromoCode,
				Rate:              promotion.Rate,
				BlazeID:           promotion.BlazeID,
			}, nil
		}
	}

	return nil, nil
}

func (a *App) ListJaneSpecials(ctx context.Context, accountID string, storeID string, janeStoreID []string, enabled *bool, flushCache *bool, enabledToday *bool) ([]*model.JaneSpecial, error) {
	if len(janeStoreID) == 0 {
		return nil, errors.New("at least one jane store id must be provided")
	}

	if flushCache == nil || !*flushCache {
		promotionKey := a.GetResourceKey(
			accountID,
			storeID,
			"jane_promotions.json",
		)

		s3Params := &s3.GetObjectInput{
			Bucket: &a.Config.BucketName,
			Key:    &promotionKey,
		}

		sData, err := a.Services.S3.GetObject(ctx, s3Params)
		if err == nil {
			return a.getjaneSpecialCachedData(sData, janeStoreID, enabled, enabledToday)
		}
	}

	appKey := a.GetResourceKey(
		accountID,
		storeID,
		a.Config.AppKey,
	)

	janeApp, err := a.Services.App.GetByHandler(ctx,
		appKey, "jane")
	if err != nil {
		a.Logger.Error(err)
		return nil, err
	}

	if janeApp == nil {
		return nil, errors.New("jane app is not configured")
	}

	jApp := (*janeApp).(model.Jane)

	jSrv := jane.NewService(*jApp.AppID,
		*jApp.APIKey,
		*jApp.ProductIndex,
		*jApp.ReviewsIndex,
		*jApp.StoresIndex,
		*jApp.StoreID,
		*jApp.Host,
		*jApp.ClientID,
		*jApp.ClientSecret,
		*jApp.OperationClientID,
		*jApp.OperationClientSecret,
		resty.New().SetTimeout(1*time.Minute))

	specialMap := make(map[string]*model.JaneSpecial)

	specials := make([]*model.JaneSpecial, 0)

	eg, _ := errgroup.WithContext(ctx)

	specialsTotal := 500

	today := time.Now()

	now := time.Date(today.Year(), today.Month(), today.Day(), 0, 0, 0, 0, today.Location()).UTC()

	var mtx sync.Mutex

	for i := range janeStoreID {
		stID := janeStoreID[i]

		var next *int

		eg.Go(func() error {
			for {
				mtx.Lock()
				defer mtx.Unlock()

				jSpecials, pageID, err := jSrv.GetSpecials(ctx, stID, enabled, next, &specialsTotal)
				if err != nil {
					return err
				}

				for i := range jSpecials {
					special := a.mapJaneSpecialToSpecial(jSpecials[i], stID)

					if enabledToday != nil && *enabledToday && !a.checkDaySpecialIsEnabled(*special, now.Weekday()) {
						continue
					}

					if special.StartDate != nil {
						date, err := time.Parse("2006-01-02", *special.StartDate)
						if err != nil {
							continue
						}

						if now.Before(date.AddDate(0, 0, -1)) {
							continue
						}
					}

					if special.EndDate != nil {
						date, err := time.Parse("2006-01-02", *special.EndDate)
						if err != nil {
							continue
						}

						if now.After(date.AddDate(0, 0, 1)) {
							continue
						}
					}

					specialMap[*special.ID] = special
				}

				next = pageID

				if next == nil {
					return nil
				}
			}
		})
	}

	if err := eg.Wait(); err != nil {
		return nil, err
	}

	for k := range specialMap {
		specials = append(specials, specialMap[k])
	}

	if err := a.saveSpecialsCache(ctx, accountID, storeID, specials); err != nil {
		return nil, err
	}

	return specials, nil
}

func (a *App) getjaneSpecialCachedData(sData *s3.GetObjectOutput, janeStoreID []string, enabled *bool, enabledToday *bool) ([]*model.JaneSpecial, error) {
	d, err := ioutil.ReadAll(sData.Body)
	if err != nil {
		return nil, err
	}

	var cachedSpecials []*model.JaneSpecial

	if err := json.Unmarshal(d, &cachedSpecials); err != nil {
		return nil, err
	}

	specialsMap := make(map[string][]*model.JaneSpecial)

	for i := range cachedSpecials {
		if _, ok := specialsMap[*cachedSpecials[i].StoreID]; !ok {
			specialsMap[*cachedSpecials[i].StoreID] = []*model.JaneSpecial{}
		}

		specialsMap[*cachedSpecials[i].StoreID] = append(specialsMap[*cachedSpecials[i].StoreID], cachedSpecials[i])
	}

	nSpecials := make([]*model.JaneSpecial, 0)

	today := time.Now()

	for i := range janeStoreID {
		v, ok := specialsMap[janeStoreID[i]]
		if !ok {
			continue
		}

		fSpecials := make([]*model.JaneSpecial, 0)

		for j := range v {
			if enabled != nil && *v[j].Enabled != *enabled {
				continue
			}

			if enabledToday != nil && *enabledToday && !a.checkDaySpecialIsEnabled(*v[j], today.Weekday()) {
				continue
			}

			if enabled == nil || *v[j].Enabled == *enabled {
				fSpecials = append(fSpecials, v[j])
			}
		}

		nSpecials = append(nSpecials, fSpecials...)
	}

	return nSpecials, nil
}

func (a *App) saveSpecialsCache(ctx context.Context, accountID string, storeID string, specials []*model.JaneSpecial) error {
	promotionKey := a.GetResourceKey(
		accountID,
		storeID,
		"jane_promotions.json",
	)

	b, err := json.MarshalIndent(specials, "", "\t")
	if err != nil {
		return err
	}

	body := bytes.NewReader(b)

	s3Params := &s3.PutObjectInput{
		Bucket: &a.Config.BucketName,
		Key:    &promotionKey,
		Body:   body,
	}

	if _, err := a.Services.S3.PutObject(ctx, s3Params); err == nil {
		return err
	}

	return nil
}

func (a *App) checkDaySpecialIsEnabled(special model.JaneSpecial, day time.Weekday) bool {
	switch day {
	case time.Sunday:
		return a.checkBooleanValueEnabled(special.EnabledSunday)
	case time.Monday:
		return a.checkBooleanValueEnabled(special.EnabledMonday)
	case time.Tuesday:
		return a.checkBooleanValueEnabled(special.EnabledTuesday)
	case time.Wednesday:
		return a.checkBooleanValueEnabled(special.EnabledWednesday)
	case time.Thursday:
		return a.checkBooleanValueEnabled(special.EnabledThursday)
	case time.Friday:
		return a.checkBooleanValueEnabled(special.EnabledFriday)
	default:
		return a.checkBooleanValueEnabled(special.EnabledSaturday)
	}
}

func (a *App) checkBooleanValueEnabled(v *bool) bool {
	if v == nil {
		return false
	}

	return *v
}
