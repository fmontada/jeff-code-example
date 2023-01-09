package resolver

import (
	"context"

	"github.com/gap-commerce/srv-ecommerce/internal/app"
	"github.com/gap-commerce/srv-emberz/pkg/model"
)

func (r *mutationResolver) SubscribeToCrm(ctx context.Context, accountID string, storeID string, input model.SubscribeCRMInput) (*bool, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)

	if err := r.app.SubscribeToCrm(ct, accountID, storeID, input); err != nil {
		r.app.Logger.Error(err)

		return nil, err
	}

	v := true

	return &v, nil
}
