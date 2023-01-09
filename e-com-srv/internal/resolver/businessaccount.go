package resolver

import (
	"context"

	"github.com/gap-commerce/srv-emberz/pkg/model"
)

func (r *queryResolver) AllBusinessAccounts(ctx context.Context) ([]*model.BusinessAccount, error) {
	businessAccounts, err := r.app.Services.BusinessAccount.GetAll(ctx, r.app.Config.BusinessAccountKey)
	if err != nil {
		return nil, err
	}

	return businessAccounts, nil
}

func (r *queryResolver) GetBusinessAccount(ctx context.Context, id string) (*model.BusinessAccount, error) {
	businessAccount, err := r.app.Services.BusinessAccount.Get(ctx, id, r.app.Config.BusinessAccountKey)
	if err != nil {
		return nil, err
	}

	return businessAccount, nil
}

func (r *mutationResolver) CreateBusinessAccount(ctx context.Context, input model.BusinessAccountInput) (*model.BusinessAccount, error) {
	businessAccount, err := r.app.Services.BusinessAccount.Create(ctx, r.app.MapBusinessAccount(input), r.app.Config.BusinessAccountKey)
	if err != nil {
		return nil, err
	}

	return businessAccount, nil
}

func (r *mutationResolver) UpdateBusinessAccount(ctx context.Context, input model.BusinessAccountInput) (*model.BusinessAccount, error) {
	businessAccount, err := r.app.Services.BusinessAccount.Update(ctx, r.app.MapBusinessAccount(input), r.app.Config.BusinessAccountKey)
	if err != nil {
		return nil, err
	}

	return businessAccount, nil
}

func (r *mutationResolver) RemoveBusinessAccount(ctx context.Context, id string) (*string, error) {
	if err := r.app.Services.BusinessAccount.Delete(ctx, id, r.app.Config.BusinessAccountKey); err != nil {
		return nil, err
	}

	v := "ok"

	return &v, nil
}
