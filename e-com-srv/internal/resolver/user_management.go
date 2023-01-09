package resolver

import (
	"context"

	"github.com/gap-commerce/srv-ecommerce/internal/app"
	"github.com/gap-commerce/srv-emberz/pkg/auth"
	"github.com/gap-commerce/srv-emberz/pkg/model"
)

func (r *queryResolver) ListAccounts(ctx context.Context, accountID string,
	storeID string, cursor *string,
	accountFilter *model.AccountFilter) (
	*model.AccountCursorPagination, error) {

	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)

	return r.app.ListAccounts(ct, accountID, storeID, cursor, accountFilter)
}

func (r *queryResolver) GetAccount(ctx context.Context, accountID string,
	storeID string, id string) (*model.Account, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)

	return r.app.GetAccount(ct, accountID, storeID, id)
}

func (r *queryResolver) GetAccountByEmail(ctx context.Context,
	accountID string, storeID string, email string) (*model.Account, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)

	return r.app.GetAccountByEmail(ct, accountID, storeID, email)
}

func (r *mutationResolver) MigrateUser(ctx context.Context, accountID string,
	storeID string, username string, password string) (*bool, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)

	return r.app.MigrateUser(ct, accountID, storeID, username, password)
}

func (r *mutationResolver) CreateAccount(ctx context.Context, accountID string, storeID string,
	input model.CreateAccountInput) (*model.Account, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)

	return r.app.CreateAccount(ct, accountID, storeID, input)
}

func (r *mutationResolver) UpdateAccount(ctx context.Context,
	accountID string, storeID string,
	input model.UpdateAccountInput) (*model.Account, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)

	return r.app.UpdateAccount(ct, accountID, storeID, input)
}

func (r *mutationResolver) UploadAccountPhoto(ctx context.Context,
	accountID string, storeID string,
	input model.AccountUploadPhotoInput) (*model.UploadAccountPhotoResponse,
	error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)

	cUser := auth.GetUserFromCtx(ctx)

	return r.app.UploadAccountPhoto(ct, accountID, storeID, cUser.ID, input)
}

func (r *queryResolver) GetAccountPhoto(ctx context.Context,
	filename string) (*string, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)

	cUser := auth.GetUserFromCtx(ctx)

	return r.app.GetAccountPhoto(ct, filename, cUser)
}
