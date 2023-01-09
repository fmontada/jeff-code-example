package resolver

import (
	"context"
	"github.com/gap-commerce/srv-emberz/pkg/model"
)

func (r *queryResolver) ListUsers(ctx context.Context,
	accountID string, storeID *string) ([]*model.User, error) {
	users, err := r.app.ListUsers(ctx, accountID, storeID)
	if err != nil {
		return nil, err
	}
	return r.app.MapUserList(users), nil
}

func (r *queryResolver) GetUser(ctx context.Context,
	userID string) (*model.User, error) {
	return r.app.GetUser(ctx, userID)
}

func (r *mutationResolver) CreateUser(ctx context.Context,
	input model.UserInput) (*model.User, error) {
	u := r.app.MapUserInputToUser(input)

	return r.app.CreateUser(ctx, u)
}

func (r *mutationResolver) UpdateUser(ctx context.Context,
	input model.UserInput) (*model.User, error) {
	u := r.app.MapUserInputToUser(input)

	return r.app.UpdateUser(ctx, u)
}
