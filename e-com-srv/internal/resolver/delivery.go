package resolver

import (
	"context"

	"github.com/gap-commerce/srv-ecommerce/internal/app"
	"github.com/gap-commerce/srv-emberz/pkg/model"
)

func (r *queryResolver) ListHubs(ctx context.Context,
	accountID string, storeID string) ([]*model.DeliveryHub, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)
	return r.app.GetDeliveryHubs(ct, accountID, storeID)
}

func (r *queryResolver) ListWorkersInLocation(ctx context.Context,
	accountID string, storeID string, location []*float64,
	radius *float64) ([]*model.DeliveryWorker, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)
	return r.app.ListWorkersInLocation(ct, accountID, storeID, location, radius)
}

func (r *queryResolver) GetDeliveryEta(ctx context.Context,
	accountID string, storeID string, location []*float64,
	notIncludedVehicles []*model.DeliveryVehicleType) ([]*model.DeliveryEta, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)
	return r.app.GetDeliveryEta(ct, accountID, storeID, location, notIncludedVehicles)
}

func (r *queryResolver) GetDistance(ctx context.Context, from model.Coordinates, to model.Coordinates) ([]*model.Distance, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)

	return r.app.GetDistance(ct, from, to)
}
