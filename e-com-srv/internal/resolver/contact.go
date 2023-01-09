package resolver

import (
	"context"

	"github.com/gap-commerce/srv-emberz/pkg/model"
)

func (r *mutationResolver) SendContactEmail(ctx context.Context, accountID string, storeID string, input model.ContactInput) (*string, error) {
	return r.app.SendContactEmail(ctx, accountID, storeID, input)
}
