package resolver

import (
	"context"

	"github.com/gap-commerce/srv-ecommerce/internal/app"
	"github.com/gap-commerce/srv-emberz/pkg/model"
)

func (r *queryResolver) ListPromotions(
	ctx context.Context,
	accountID string,
	storeID string,
) ([]*model.Promotion, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)

	pKey := r.app.GetResourceKey(
		accountID,
		storeID,
		r.app.Config.PromotionKey,
	)

	ps, err := r.app.Services.Promotion.GetAll(ct, pKey)
	if err != nil {
		return nil, err
	}

	return r.app.MapPromotionList(ps), nil
}

func (r *queryResolver) ListActivePromotions(
	ctx context.Context,
	accountID string,
	storeID string,
) ([]*model.Promotion, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)

	pKey := r.app.GetResourceKey(
		accountID,
		storeID,
		r.app.Config.PromotionKey,
	)

	ps, err := r.app.Services.Promotion.GetActives(ct, pKey)
	if err != nil {
		return nil, err
	}

	return r.app.MapPromotionList(ps), nil
}

func (r *queryResolver) GetActivePromotion(
	ctx context.Context,
	accountID string,
	storeID string,
	promotionID string,
) (*model.Promotion, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)

	pKey := r.app.GetResourceKey(
		accountID,
		storeID,
		r.app.Config.PromotionKey,
	)

	return r.app.Services.Promotion.GetActive(ct, promotionID, pKey)
}

func (r *queryResolver) GetPromotion(
	ctx context.Context,
	accountID string,
	storeID string,
	promotionID string,
) (*model.Promotion, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)

	pKey := r.app.GetResourceKey(
		accountID,
		storeID,
		r.app.Config.PromotionKey,
	)

	return r.app.Services.Promotion.Get(ct, promotionID, pKey)
}

func (r *mutationResolver) CreatePromotion(ctx context.Context,
	accountID string, storeID string,
	input model.PromotionInput) (*model.Promotion, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)

	pKey := r.app.GetResourceKey(
		accountID,
		storeID,
		r.app.Config.PromotionKey,
	)

	return r.app.Services.Promotion.Create(ct,
		r.
			app.
			MapPromotionInputToPromotion(input),
		pKey)
}

func (r *mutationResolver) UpdatePromotion(ctx context.Context,
	accountID string, storeID string,
	input model.PromotionInput) (*model.Promotion, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)

	pKey := r.app.GetResourceKey(
		accountID,
		storeID,
		r.app.Config.PromotionKey,
	)

	return r.app.Services.Promotion.Update(ct,
		r.
			app.
			MapPromotionInputToPromotion(input),
		pKey)
}

func (r *mutationResolver) DeletePromotion(ctx context.Context,
	accountID string, storeID string,
	id string) (*string, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)

	pKey := r.app.GetResourceKey(
		accountID,
		storeID,
		r.app.Config.PromotionKey,
	)

	return nil, r.
		app.
		Services.
		Promotion.
		Delete(ct, id, pKey)
}

func (r *mutationResolver) ApplyPromoCode(ctx context.Context,
	accountID string, storeID string,
	orderID string, promoCode string) (*model.OrderDiscountItem, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)

	return r.
		app.
		ApplyPromotionCode(ct,
			accountID,
			storeID,
			orderID,
			promoCode)
}

func (r *queryResolver) ListJaneSpecials(ctx context.Context, accountID string, storeID string, janeStoreID []string, enabled *bool, flushCache *bool, enabledToday *bool) ([]*model.JaneSpecial, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)

	specials, err := r.app.ListJaneSpecials(ct, accountID, storeID, janeStoreID, enabled, flushCache, enabledToday)
	if err != nil {
		r.app.Logger.Error(err)

		return nil, err
	}

	return specials, nil
}
