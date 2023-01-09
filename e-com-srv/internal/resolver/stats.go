package resolver

import (
	"context"
	"github.com/gap-commerce/srv-emberz/pkg/model"
)

func (r *queryResolver) GetStats(ctx context.Context,
	accountID string, storeID string) (*model.Stats, error) {
	return r.app.GetStats(ctx, accountID, storeID)
}

func (r *queryResolver) GetSnapshot(ctx context.Context, accountID string,
	storeID string, option int) (*model.StatSnapShot, error) {
	return r.app.GetSnapshot(ctx, accountID, storeID, option)
}
