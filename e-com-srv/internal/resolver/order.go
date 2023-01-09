package resolver

import (
	"context"

	"github.com/gap-commerce/srv-ecommerce/internal/app"
	"github.com/gap-commerce/srv-emberz/pkg/model"
)

func (r *queryResolver) GetOrder(ctx context.Context, accountID string, storeID string, entityID string) (*model.Order, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)

	return r.app.GetOrder(ct, accountID, storeID, entityID)
}

func (r *queryResolver) ListStoreOrders(ctx context.Context, accountID string, storeID string, cursor *string, after *string, before *string, first *int, last *int, query string) (*model.OrderConnection, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)

	return r.app.ListStoreOrders(ct, accountID, storeID, cursor, after, before, first, last, query)
}

func (r *queryResolver) CustomerOrderHistory(ctx context.Context, accountID string, storeID string, cursor *string, email string, totalPrice *int) (*model.OrderCursorPagination, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)

	return r.app.CustomerOrderHistory(ct, accountID, storeID, cursor, email, totalPrice)
}

func (r *mutationResolver) UpdateCart(ctx context.Context, accountID string, storeID string, input model.UpdateCartInput) (*model.Order, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)

	cd := ctx.Value("client_detail").(model.ClientDetail)

	return r.app.UpdateCart(ct, accountID, storeID, r.app.MapOrderInputToOrder(*input.Order), &cd)
}

func (r *mutationResolver) UpdateJaneCart(ctx context.Context, accountID string, storeID string, input model.UpdateCartInput) (*model.Order, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)

	cd := ctx.Value("client_detail").(model.ClientDetail)

	return r.app.UpdateJaneCart(ct, accountID, storeID, r.app.MapOrderInputToOrder(*input.Order), &cd)
}

func (r *mutationResolver) SubmitCart(ctx context.Context, accountID string, storeID string, entityID string) (*string, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)

	err := r.app.SubmitCart(ct, accountID, storeID, entityID)
	if err != nil {
		return nil, err
	}

	res := "success"

	return &res, nil
}

func (r *mutationResolver) CreateOrder(ctx context.Context, accountID string, storeID string, input model.OrderInput) (*model.Order, error) {
	panic("")
}

func (r *mutationResolver) UpdateOrder(ctx context.Context, accountID string, storeID string, input model.OrderInput) (*model.Order, error) {
	panic("")
}
