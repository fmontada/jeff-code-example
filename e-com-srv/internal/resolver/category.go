package resolver

import (
	"context"

	"github.com/gap-commerce/srv-ecommerce/internal/app"
	"github.com/gap-commerce/srv-emberz/pkg/model"
)

func (r *queryResolver) ListCategory(
	ctx context.Context,
	accountID string,
	storeID string,
) ([]*model.Category, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)
	key := r.app.GetResourceKey(accountID, storeID, r.app.Config.CategoryKey)
	categories, err := r.app.Services.Category.GetAll(ct, key)

	if err != nil {
		return nil, err
	}

	return categories, nil
}

func (r *queryResolver) GetCategory(
	ctx context.Context,
	accountID string,
	storeID string,
	categoryID string,
) (*model.Category, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)
	key := r.app.GetResourceKey(accountID, storeID, r.app.Config.CategoryKey)
	category, err := r.app.Services.Category.Get(ct, categoryID, key)

	if err != nil {
		return nil, err
	}

	return category, nil
}

func (r *mutationResolver) UpdateCategory(ctx context.Context, accountID string, storeID string, input model.CategoryInput) (*model.Category, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)
	key := r.app.GetResourceKey(accountID, storeID, r.app.Config.CategoryKey)

	return r.app.Services.Category.Update(ct, r.app.MapCategoryInput(input), key)
}
