package app

import (
	"context"
	"errors"

	//"github.com/gap-commerce/srv-emberz/pkg/ecommerce/jane"
	"github.com/gap-commerce/srv-emberz/pkg/ecommerce/jane"
	"github.com/gap-commerce/srv-emberz/pkg/erp/blaze"
	"github.com/gap-commerce/srv-emberz/pkg/model"

	"github.com/gap-commerce/srv-emberz/pkg/services/inventory_sync"
	inventorySync "github.com/gap-commerce/srv-emberz/pkg/services/inventory_sync"
	janeInventorySync "github.com/gap-commerce/srv-emberz/pkg/services/inventory_sync/jane"
	"github.com/go-resty/resty/v2"
)

func (a *App) SyncFromBlaze(ctx context.Context,
	accountID string, storeID string) error {
	appKey := a.GetResourceKey(
		accountID,
		storeID,
		a.Config.AppKey,
	)

	blazeApp, err := a.Services.App.GetByHandler(ctx,
		appKey, "blaze")
	if err != nil {
		a.Logger.Error(err)
		return err
	}

	if blazeApp == nil {
		return errors.New("blaze app is not configured")
	}

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

	bSrv := blaze.NewService(rst, blaze.Config{
		PartnerKey: *partnerKey,
		AuthKey:    *authKey,
		Sandbox:    sandbox,
	})

	productKey := a.GetResourceKey(accountID, storeID, a.Config.ProductKey)
	categoryKey := a.GetResourceKey(accountID, storeID, a.Config.CategoryKey)
	promotionKey := a.GetResourceKey(accountID, storeID, a.Config.PromotionKey)
	brandKey := a.GetResourceKey(accountID, storeID, a.Config.BrandKey)
	vendorKey := a.GetResourceKey(accountID, storeID, a.Config.VendorKey)

	err = a.
		Services.
		InventorySync.
		Sync(ctx, inventorySync.Resource{
			ProductKey:   productKey,
			CategoryKey:  categoryKey,
			PromotionKey: promotionKey,
			BrandKey:     brandKey,
			VendorKey:    vendorKey,
		}, bSrv)

	if err != nil {
		a.Logger.Error(err)
		return err
	}

	return nil
}

func (a *App) SyncFromJane(ctx context.Context,
	accountID string, storeID string) error {
	appKey := a.GetResourceKey(
		accountID,
		storeID,
		a.Config.AppKey,
	)

	janeApp, err := a.Services.App.GetByHandler(ctx,
		appKey, "jane")
	if err != nil {
		a.Logger.Error(err)
		return err
	}

	if janeApp == nil {
		return errors.New("jane app is not configured")
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

	productKey := a.GetResourceKey(accountID, storeID, a.Config.ProductKey)
	categoryKey := a.GetResourceKey(accountID, storeID, a.Config.CategoryKey)
	brandKey := a.GetResourceKey(accountID, storeID, a.Config.BrandKey)

	jSyncService := janeInventorySync.NewJaneService(a.Services.Product, a.Services.Category, a.Services.Brand, a.Services.Promotion)

	return jSyncService.Sync(ctx, inventory_sync.Resource{
		ProductKey:  productKey,
		CategoryKey: categoryKey,
		BrandKey:    brandKey,
	}, jSrv)
}
