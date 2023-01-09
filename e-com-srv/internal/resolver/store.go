package resolver

import (
	"context"

	"github.com/gap-commerce/srv-ecommerce/internal/app"
	"github.com/gap-commerce/srv-emberz/pkg/auth"
	"github.com/gap-commerce/srv-emberz/pkg/model"
)

func (r *queryResolver) GetStore(ctx context.Context,
	accountID string,
	storeID string) (*model.Store, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)

	key := r.app.GetResourceKey(accountID,
		storeID, r.app.Config.StoreKey)

	return r.app.Services.Store.Get(ct, key)
}

func (r *queryResolver) ListStoresFromAccount(ctx context.Context,
	accountID string) ([]*model.Store, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)

	st, err := r.app.Services.Store.GetByAccount(ct,
		accountID, r.app.Config.StoreKey)
	if err != nil {
		return nil, err
	}

	return r.app.MapStoreList(st), err
}

func (r *queryResolver) AllStores(ctx context.Context) ([]*model.Store, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)

	st, err := r.app.Services.Store.GetAll(ct,
		r.app.Config.StoreKey)
	if err != nil {
		return nil, err
	}

	return r.app.MapStoreList(st), err
}

func (r *queryResolver) GetStoreMenu(ctx context.Context) ([]*model.StoreMenu, error) {
	user := auth.GetUserFromCtx(ctx)

	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)

	rls := make([]string, 0, len(user.Roles))

	for i, _ := range user.Roles {
		rls = append(rls, user.Roles[i])
	}

	ms, err := r.app.Services.Store.GetMenu(ct, user.AccountID,
		r.app.Config.StoreKey, rls)
	if err != nil {
		return nil, err
	}

	return r.app.MapStoreMenuList(ms), nil
}

func (r *mutationResolver) CreateStore(ctx context.Context, accountID string,
	input model.StoreInput) (*model.Store, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)

	return r.app.CreateStore(ct, accountID, input)
}

func (r *mutationResolver) UpdateStore(ctx context.Context, accountID string, input model.StoreInput) (*model.Store, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)

	key := r.app.GetResourceKey(accountID, *input.ID, r.app.Config.StoreKey)

	return r.app.Services.Store.Update(ct,
		r.app.MapStoreInputToStore(input),
		key)
}

func (r *mutationResolver) DeleteStore(ctx context.Context, accountID string, storeID string) (*string, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)

	key := r.app.GetResourceKey(accountID,
		storeID, r.app.Config.StoreKey)

	err := r.app.Services.Store.Delete(ct, key)
	if err != nil {
		return nil, err
	}

	return &storeID, nil
}

func (r *queryResolver) ListJaneStores(ctx context.Context, accountID string, storeID string) ([]*model.JaneStore, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)

	return r.app.ListJaneStores(ct, accountID, storeID)
}
