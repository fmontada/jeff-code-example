package resolver

import (
	"context"
	"github.com/gap-commerce/srv-ecommerce/internal/app"
	"github.com/gap-commerce/srv-emberz/pkg/model"
)

func (r *queryResolver) GetBestSellingProducts(ctx context.Context,
	accountID string, storeID string, count *int) ([]*model.BestSellingProduct, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)
	key := r.app.GetResourceKey(accountID, storeID, r.app.Config.BestSellingProductsKey)

	products, err := r.app.Services.BestSellingProducts.Get(ct, key, count)
	if err != nil {
		r.app.Logger.Error(err)
		return nil, err
	}

	return r.app.MapBestSellingProducst(products), nil
}
