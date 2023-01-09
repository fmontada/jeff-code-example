package resolver

import (
	"context"

	"github.com/gap-commerce/srv-ecommerce/internal/app"
	"github.com/gap-commerce/srv-emberz/pkg/model"
)

func (r *queryResolver) ListStoreApps(
	ctx context.Context,
	accountID string,
	storeID string,
	status *bool,
	category *model.AppCategoryType,
) ([]model.App, error) {

	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)

	key := r.app.GetResourceKey(
		accountID,
		storeID,
		r.app.Config.AppKey,
	)

	var err error
	var apps []model.App

	if category == nil {
		apps, err = r.app.Services.App.GetStoreAll(ct, key)
	} else {
		apps, err = r.app.Services.App.GetAllByCategoryInStore(ct, *category, key)
	}

	if err != nil {
		return nil, err
	}

	if status == nil {
		return apps, nil
	}

	nApps := make([]model.App, 0)

	for i := range apps {
		if *apps[i].GetStatus() == *status {
			nApps = append(nApps, apps[i])
		}
	}

	return nApps, nil
}

func (r *queryResolver) GetStoreApp(
	ctx context.Context,
	accountID string,
	storeID string,
	appID string,
) (model.App, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)

	key := r.app.GetResourceKey(
		accountID,
		storeID,
		r.app.Config.AppKey,
	)

	app, err := r.app.Services.App.GetInStore(ct, appID, key)
	if err != nil {
		return nil, err
	}

	return *app, nil
}

func (r *queryResolver) ListApps(ctx context.Context) ([]model.App, error) {

	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)

	apps, err := r.app.Services.App.GetAll(ct, r.app.Config.AppKey)

	if err != nil {
		return nil, err
	}

	return apps, nil
}

func (r *queryResolver) GetApp(
	ctx context.Context,
	appID string,
) (model.App, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)

	app, err := r.app.Services.App.Get(ct, appID, r.app.Config.AppKey)
	if err != nil {
		return nil, err
	}

	return *app, nil
}

func (r *mutationResolver) CreateApp(ctx context.Context, input model.SystemAppInput) (model.App, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)

	app, err := r.app.Services.App.Create(ct, r.app.MapSystemApp(input), r.app.Config.AppKey)
	if err != nil {
		r.app.Logger.Error(err)

		return nil, err
	}

	return *app, err
}

func (r *mutationResolver) UpdateApp(ctx context.Context, input model.SystemAppInput) (model.App, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)

	app, err := r.app.Services.App.Update(ct, r.app.MapSystemApp(input), r.app.Config.AppKey)
	if err != nil {
		r.app.Logger.Error(err)

		return nil, err
	}

	return *app, err
}

func (r *mutationResolver) ActivateAppForStore(ctx context.Context,
	accountID string, storeID string,
	input model.SystemAppInput) (model.App, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)

	key := r.app.GetResourceKey(
		accountID,
		storeID,
		r.app.Config.AppKey,
	)

	app, err := r.app.Services.App.Enable(ct, *input.ID, key)
	if err != nil {
		return nil, err
	}

	return *app, nil
}

func (r *mutationResolver) DeactivateAppForStore(ctx context.Context, accountID string, storeID string, input model.SystemAppInput) (model.App, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)

	key := r.app.GetResourceKey(
		accountID,
		storeID,
		r.app.Config.AppKey,
	)

	app, err := r.app.Services.App.Disable(ct, *input.ID, key)
	if err != nil {
		return nil, err
	}

	return *app, nil
}

func (r *mutationResolver) UpdateFacebookCatalogApp(ctx context.Context,
	accountID string, storeID string,
	input model.FacebookCatalogInput) (model.App, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)

	key := r.app.GetResourceKey(
		accountID,
		storeID,
		r.app.Config.AppKey,
	)

	app, err := r.
		app.
		Services.
		App.UpdateInStore(ct, r.app.MapFacebookCatalogInputFacebook(input), key)
	if err != nil {
		return nil, err
	}

	return *app, nil
}

func (r *mutationResolver) CreateFacebookCatalogProducts(ctx context.Context, accountID string, storeID string) (*string, error) {
	panic("not implemented")
}

func (r *mutationResolver) UpdateMetafieldApp(ctx context.Context,
	accountID string, storeID string,
	input model.MetafieldInput) (model.App, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)

	key := r.app.GetResourceKey(
		accountID,
		storeID,
		r.app.Config.AppKey,
	)

	app, err := r.
		app.
		Services.
		App.UpdateInStore(ct, r.app.MapMetafieldInputToMetafield(input), key)
	if err != nil {
		return nil, err
	}

	return *app, nil
}

func (r *mutationResolver) UpdateLeafLogixApp(ctx context.Context,
	accountID string, storeID string,
	input model.LeafLogixInput) (model.App, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)

	key := r.app.GetResourceKey(
		accountID,
		storeID,
		r.app.Config.AppKey,
	)

	app, err := r.
		app.
		Services.
		App.UpdateInStore(ct, r.app.MapLeafLogicAppInputToLeafLogixApp(input), key)
	if err != nil {
		return nil, err
	}

	return *app, nil
}

func (r *mutationResolver) UpdateBlazeApp(ctx context.Context, accountID string, storeID string, input model.BlazeInput) (model.App, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)

	key := r.app.GetResourceKey(
		accountID,
		storeID,
		r.app.Config.AppKey,
	)

	app, err := r.
		app.
		Services.
		App.UpdateInStore(ct, r.app.MapBlazeInput(input), key)
	if err != nil {
		return nil, err
	}

	return *app, nil
}

func (r *mutationResolver) UpdateOnFleetApp(ctx context.Context, accountID string, storeID string, input model.OnFleetInput) (model.App, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)

	key := r.app.GetResourceKey(
		accountID,
		storeID,
		r.app.Config.AppKey,
	)

	app, err := r.
		app.
		Services.
		App.UpdateInStore(ct, r.app.MapOnFleetInput(input), key)
	if err != nil {
		return nil, err
	}

	return *app, nil
}

func (r *mutationResolver) UpdateBerbixApp(ctx context.Context, accountID string, storeID string, input model.BerbixInput) (model.App, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)

	key := r.app.GetResourceKey(
		accountID,
		storeID,
		r.app.Config.AppKey,
	)

	app, err := r.
		app.
		Services.
		App.UpdateInStore(ct, r.app.MapBerbixInput(input), key)
	if err != nil {
		return nil, err
	}

	return *app, nil
}

func (r *mutationResolver) UpdateJaneApp(ctx context.Context, accountID string, storeID string, input model.JaneInput) (model.App, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)

	key := r.app.GetResourceKey(
		accountID,
		storeID,
		r.app.Config.AppKey,
	)

	app, err := r.
		app.
		Services.
		App.UpdateInStore(ct, r.app.MapJaneInput(input), key)
	if err != nil {
		return nil, err
	}

	return *app, nil
}

func (r *mutationResolver) UpdateTreezApp(ctx context.Context, accountID string, storeID string, input model.TreezInput) (model.App, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)

	key := r.app.GetResourceKey(
		accountID,
		storeID,
		r.app.Config.AppKey,
	)

	app, err := r.
		app.
		Services.
		App.UpdateInStore(ct, r.app.MapTreezInput(input), key)
	if err != nil {
		return nil, err
	}

	return *app, nil
}

// // foo
func (r *mutationResolver) UpdateDutchieApp(ctx context.Context, accountID string, storeID string, input model.DutchieInput) (model.App, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)

	key := r.app.GetResourceKey(
		accountID,
		storeID,
		r.app.Config.AppKey,
	)

	app, err := r.
		app.
		Services.
		App.UpdateInStore(ct, r.app.MapDutchieInput(input), key)
	if err != nil {
		return nil, err
	}

	return *app, nil
}

func (r *mutationResolver) UpdateCovaApp(ctx context.Context, accountID string, storeID string, input model.CovaInput) (model.App, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)

	key := r.app.GetResourceKey(
		accountID,
		storeID,
		r.app.Config.AppKey,
	)

	app, err := r.
		app.
		Services.
		App.UpdateInStore(ct, r.app.MapCovaInput(input), key)
	if err != nil {
		return nil, err
	}

	return *app, nil
}

func (r *mutationResolver) UpdateRedirectApp(ctx context.Context, accountID string, storeID string, input model.RedirectInput) (model.App, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)

	key := r.app.GetResourceKey(
		accountID,
		storeID,
		r.app.Config.AppKey,
	)

	app, err := r.
		app.
		Services.
		App.UpdateInStore(ct, r.app.MapRedirectInput(input), key)
	if err != nil {
		return nil, err
	}

	return *app, nil
}

func (r *mutationResolver) UpdateMinZipByCodeApp(ctx context.Context, accountID string, storeID string, input model.MinByZipCodeInput) (model.App, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)

	key := r.app.GetResourceKey(
		accountID,
		storeID,
		r.app.Config.AppKey,
	)

	app, err := r.
		app.
		Services.
		App.UpdateInStore(ct, r.app.MapMinZipByCodeInput(input), key)
	if err != nil {
		return nil, err
	}

	return *app, nil
}

func (r *mutationResolver) UpdateKlaviyoApp(ctx context.Context, accountID string, storeID string, input model.KlaviyoInput) (model.App, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)

	key := r.app.GetResourceKey(
		accountID,
		storeID,
		r.app.Config.AppKey,
	)

	app, err := r.
		app.
		Services.
		App.UpdateInStore(ct, r.app.MapKlaviyoInput(input), key)
	if err != nil {
		return nil, err
	}

	return *app, nil
}

func (r *mutationResolver) UpdateOmnisendApp(ctx context.Context, accountID string, storeID string, input model.OmnisendInput) (model.App, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)

	key := r.app.GetResourceKey(
		accountID,
		storeID,
		r.app.Config.AppKey,
	)

	app, err := r.
		app.
		Services.
		App.UpdateInStore(ct, r.app.MapOmnisendInput(input), key)
	if err != nil {
		return nil, err
	}

	return *app, nil
}
