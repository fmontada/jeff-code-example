package resolver

import (
	"context"

	"github.com/gap-commerce/srv-ecommerce/internal/app"
	"github.com/gap-commerce/srv-emberz/pkg/model"
)

func (r *queryResolver) ListBrands(ctx context.Context,
	accountID string, storeID string) ([]*model.Brand, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)

	key := r.app.GetResourceKey(
		accountID,
		storeID,
		r.app.Config.BrandKey,
	)

	d, err := r.app.Services.Brand.GetAll(ct, key)
	if err != nil {
		return nil, err
	}

	return r.app.MapBrandList(d), nil
}

func (r *queryResolver) GetBrand(ctx context.Context,
	accountID string, storeID string,
	brandID string) (*model.Brand, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)

	key := r.app.GetResourceKey(
		accountID,
		storeID,
		r.app.Config.BrandKey,
	)

	return r.app.Services.Brand.Get(ct, brandID, key)
}

func (r *mutationResolver) UpdateBrand(ctx context.Context, accountID string, storeID string,
	input model.BrandInput) (*model.Brand, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)

	key := r.app.GetResourceKey(
		accountID,
		storeID,
		r.app.Config.BrandKey,
	)

	return r.app.Services.Brand.Update(ct, r.app.MapInputBrandToBrand(input), key)
}
