package resolver

import (
	"context"
	"github.com/gap-commerce/srv-ecommerce/internal/app"
	"github.com/gap-commerce/srv-emberz/pkg/model"
)

func (r *queryResolver) ListNavigations(ctx context.Context,
	accountID string,
	storeID string) ([]*model.Navigation, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)
	key := r.app.GetResourceKey(accountID, storeID, r.app.Config.NavigationKey)

	ns, err := r.app.Services.Navigation.GetAll(ct, key)
	if err != nil{
		return nil, err
	}

	return r.app.MapNavigationList(ns), nil
}

func (r *queryResolver) GetNavigation(ctx context.Context,
	accountID string, storeID string,
	navigationID string) (*model.Navigation, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)
	key := r.app.GetResourceKey(accountID, storeID, r.app.Config.NavigationKey)

	return r.app.Services.Navigation.Get(ct, navigationID, key)
}

func (r *mutationResolver) CreateNavigation(ctx context.Context,
	accountID string, storeID string,
	input model.NavigationInput) (*model.Navigation, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)
	key := r.app.GetResourceKey(accountID, storeID, r.app.Config.NavigationKey)

	return r.app.Services.Navigation.Create(ct,
		r.app.MapNavigationInputToNavigation(input), key)
}

func (r *mutationResolver) UpdateNavigation(ctx context.Context,
	accountID string, storeID string,
	input model.NavigationInput) (*model.Navigation, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)
	key := r.app.GetResourceKey(accountID, storeID, r.app.Config.NavigationKey)

	return r.app.Services.Navigation.Update(ct, r.app.MapNavigationInputToNavigation(input), key)
}

func (r *mutationResolver) DeleteNavigation(ctx context.Context,
	accountID string, storeID string,
	input model.NavigationInput) (*string, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)
	key := r.app.GetResourceKey(accountID, storeID, r.app.Config.NavigationKey)

	err := r.app.Services.Navigation.Delete(ct, *input.ID, key)
	if err != nil{
		return nil, err
	}

	return input.ID, nil
}
