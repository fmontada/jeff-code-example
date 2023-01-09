package resolver

import (
	"context"

	"github.com/gap-commerce/srv-ecommerce/internal/app"
	"github.com/gap-commerce/srv-emberz/pkg/model"
	"github.com/gap-commerce/srv-emberz/pkg/services/product"
)

func (r *mutationResolver) SyncFromBlaze(ctx context.Context, accountID string, storeID string) (*bool, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)

	err := r.app.SyncFromBlaze(ct,
		accountID,
		storeID,
	)
	if err != nil {
		return nil, err
	}

	st := true
	return &st, nil
}

func (r *queryResolver) ListProducts(ctx context.Context, accountID string, storeID string) ([]*model.Product, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)
	key := r.app.GetResourceKey(accountID, storeID, r.app.Config.ProductKey)
	products, err := r.app.Services.Product.GetAll(ct, key)

	if err != nil {
		return nil, err
	}

	return r.app.MapProductList(products), nil
}

func (r *queryResolver) GetProduct(ctx context.Context, accountID string, storeID string, productID string) (*model.Product, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)

	key := r.app.GetResourceKey(accountID, storeID, r.app.Config.ProductKey)

	return r.app.Services.Product.Get(ct, productID, key)
}

func (r *queryResolver) GetProductByPath(ctx context.Context, accountID string, storeID string, path string) (*model.Product, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)

	return r.app.GetProductByPath(ct, accountID, storeID, path)
}

func (r *queryResolver) ListInventories(ctx context.Context, accountID string, storeID string) ([]*model.BlazeProductInventory, error) {
	return r.app.ListInventories(ctx, accountID, storeID)
}

func (r *queryResolver) ListTerminalInventory(ctx context.Context, accountID string, storeID string, inventoryID string) ([]*model.BlazeTerminalInventory, error) {
	return r.app.ListDriverInventories(ctx, accountID, storeID, inventoryID)
}

func (r *queryResolver) SearchProduct(ctx context.Context, accountID string, storeID string, after *string, before *string, first *int, last *int, query *string, sortKey *model.ProductSortKeys) (*model.ProductConnection, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)
	key := r.app.GetResourceKey(accountID, storeID, r.app.Config.ProductKey)

	connection, err := r.app.Services.Product.Search(
		ct,
		product.Pagination{
			After:  after,
			Before: before,
			First:  first,
			Last:   last,
		},
		query,
		key,
	)
	return connection, err
}

func (r *mutationResolver) UpdateProduct(ctx context.Context, accountID string, storeID string, input model.ProductInput) (*model.Product, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)
	key := r.app.GetResourceKey(accountID, storeID, r.app.Config.ProductKey)

	return r.app.Services.Product.Update(ct, r.app.MapProductInput(input), key)
}

func (r *mutationResolver) SyncFromJane(ctx context.Context, accountID string, storeID string) (*bool, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)

	err := r.app.SyncFromJane(ct,
		accountID,
		storeID,
	)
	if err != nil {
		return nil, err
	}

	st := true
	return &st, nil
}

func (r *queryResolver) GetProductReviewFromJane(ctx context.Context, accountID string, storeID string, id string) ([]*model.JaneProductReview, error) {
	return r.app.GetProductReviewFromJane(ctx, accountID, storeID, id)
}

func (r *queryResolver) GetJaneBestBundlePosibility(ctx context.Context, accountID string, storeID string, input []*model.JaneBestProductBundlePosibilityInput) (*model.JaneBestProductBundlePosibility, error) {
	panic("not implemented")
}
