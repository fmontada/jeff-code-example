package resolver

import (
	"context"

	"github.com/gap-commerce/srv-ecommerce/internal/app"
	"github.com/gap-commerce/srv-emberz/pkg/model"
)

func (r *mutationResolver) CreateBerbixClientToken(ctx context.Context, accountID string, storeID string, input model.BerbixClientTokenInput) (*model.BerbixClientToken, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)

	return r.app.CreateBerbixClientToken(ct, accountID, storeID, input)
}

func (r *queryResolver) GetBerbixTransactionResult(ctx context.Context, accountID string, storeID string, accessToken string, refreshToken string) (*model.BerbixTransactionResult, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)

	return r.app.GetBerbixTransactionResult(ct, accountID, storeID, accessToken, refreshToken)
}
