package resolver

import (
	"context"

	"github.com/gap-commerce/srv-ecommerce/internal/app"
	"github.com/gap-commerce/srv-emberz/pkg/model"
)

func (r *mutationResolver) SubscribeUser(ctx context.Context, accountID string, storeID string, input model.SubscriptionInput) (*string, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)

	return r.app.SubscribeAccount(ct, accountID, storeID, input)
}
