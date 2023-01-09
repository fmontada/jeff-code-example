package app

import (
	"context"
	"errors"

	"github.com/gap-commerce/srv-emberz/pkg/ecommerce/jane"
	"github.com/gap-commerce/srv-emberz/pkg/model"
	"github.com/go-resty/resty/v2"
)

func (a *App) CreateStore(ctx context.Context, accountID string,
	input model.StoreInput) (*model.Store, error) {

	keys := []string{a.Config.ProductKey,
		a.Config.PageKey, a.Config.NavigationKey, a.Config.CategoryKey,
		a.Config.PromotionKey, a.Config.AppKey,
		a.Config.TagKey,
		a.Config.BrandKey, a.Config.VendorKey,
		a.Config.LandingPageKey, a.Config.TaxKey, a.Config.BestSellingProductsKey}

	st, err := a.Services.Store.Create(ctx,
		a.MapStoreInputToStore(input),
		accountID, a.Config.StoreKey, keys)
	if err != nil {
		return nil, err
	}

	err = a.Services.Invoice.Upsert(ctx, 7000, *st.DynamoOrderTableName)
	if err != nil {
		return nil, err
	}

	return st, nil
}

func (a *App) ListJaneStores(ctx context.Context, accountID string, storeID string) ([]*model.JaneStore, error) {
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
		resty.New())

	jStores, err := jSrv.GetStores(ctx)
	if err != nil {
		return nil, err
	}

	stores := make([]*model.JaneStore, 0, len(jStores))

	for i := range jStores {
		store := model.JaneStore{
			ID:             &jStores[i].ID,
			City:           &jStores[i].City,
			Delivery:       &jStores[i].Delivery,
			DeliveryRadius: &jStores[i].DeliveryRadius,
			FullAddress:    &jStores[i].FullAddress,
			GoogleMapURL:   &jStores[i].GoogleMapURL,
			Medical:        &jStores[i].Medical,
			Name:           &jStores[i].Name,
			Phone:          &jStores[i].Phone,
			Pickup:         &jStores[i].PickUp,
			ProductsCount:  &jStores[i].ProductsCount,
			Rating:         &jStores[i].Rating,
			Reviews:        &jStores[i].ReviewsCount,
			Recreational:   &jStores[i].Recreational,
			State:          &jStores[i].State,
			Photo:          jStores[i].Photo,
			Description:    jStores[i].Description,
			Longitude:      &jStores[i].GeoLocation.Longitude,
			Latitude:       &jStores[i].GeoLocation.Latitude,
			DeliveryHours:  a.MapJaneStoreWorkingHours(jStores[i].DeliveryHours),
			PickupHours:    a.MapJaneStoreWorkingHours(jStores[i].PickUpHours),
			WorkingHours:   a.MapJaneStoreWorkingHours(jStores[i].WorkingHours),
		}

		stores = append(stores, &store)
	}

	return stores, nil
}
