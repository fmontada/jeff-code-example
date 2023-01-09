package resolver

import (
	"context"

	"github.com/gap-commerce/srv-ecommerce/internal/app"
	"github.com/gap-commerce/srv-emberz/pkg/model"
	"github.com/gap-commerce/srv-emberz/pkg/pagination"
)

func (r *queryResolver) ListPages(ctx context.Context, accountID string, storeID string) ([]*model.Page, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)
	key := r.app.GetResourceKey(accountID, storeID, r.app.Config.PageKey)

	d, err := r.app.Services.Page.GetAll(ct, key)
	if err != nil {
		r.app.Logger.Error(err)

		return nil, err
	}

	return r.app.MapPageList(d), nil
}

func (r *queryResolver) GetPage(ctx context.Context, accountID string, storeID string, pageID string) (*model.Page, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)
	key := r.app.GetResourceKey(accountID, storeID, r.app.Config.PageKey)

	return r.app.Services.Page.Get(ct, pageID, key)
}

func (r *mutationResolver) CreatePage(ctx context.Context, accountID string, storeID string, input model.PageInput) (*model.Page, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)
	key := r.app.GetResourceKey(accountID, storeID, r.app.Config.PageKey)

	return r.app.Services.Page.Create(ct, r.app.MapPageInputToPage(input), key)
}

func (r *mutationResolver) UpdatePage(ctx context.Context, accountID string, storeID string, input model.PageInput) (*model.Page, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)
	key := r.app.GetResourceKey(accountID, storeID, r.app.Config.PageKey)

	return r.app.Services.Page.Update(ct, r.app.MapPageInputToPage(input), key)
}

func (r *mutationResolver) DeletePage(ctx context.Context, accountID string, storeID string, input model.PageInput) (*string, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)
	key := r.app.GetResourceKey(accountID, storeID, r.app.Config.PageKey)

	err := r.app.Services.Page.Delete(ct, *input.ID, key)
	if err != nil {
		return nil, err
	}

	return input.ID, nil
}

func (r *queryResolver) ListPagesByTemplate(ctx context.Context, accountID string, storeID string, template model.Template, after *string, before *string, first *int, last *int) (*model.PageConnection, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)
	key := r.app.GetResourceKey(accountID, storeID, r.app.Config.PageKey)

	pages, err := r.app.Services.Page.ListPagesByTemplate(ct, template, key, pagination.Pagination{
		After:  after,
		Before: before,
		First:  first,
		Last:   last,
	})
	if err != nil {
		r.app.Logger.Error(err)

		return nil, err
	}

	return pages, nil
}

func (r *queryResolver) GetPageBySlug(ctx context.Context, accountID string, storeID string, slug string) (*model.Page, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)
	key := r.app.GetResourceKey(accountID, storeID, r.app.Config.PageKey)

	page, err := r.app.Services.Page.GetBySlug(ct, slug, key)
	if err != nil {
		return nil, err
	}

	return page, nil
}

func (r *queryResolver) GetPageByPath(ctx context.Context, accountID string, storeID string, path string) (*model.Page, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)
	key := r.app.GetResourceKey(accountID, storeID, r.app.Config.PageKey)

	page, err := r.app.Services.Page.GetByPath(ct, path, key)
	if err != nil {
		return nil, err
	}

	return page, nil
}

func (r *queryResolver) GetPageByTemplate(ctx context.Context, accountID string, storeID string, template model.Template) (*model.Page, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)
	key := r.app.GetResourceKey(accountID, storeID, r.app.Config.PageKey)

	page, err := r.app.Services.Page.GetByTemplate(ct, template, key)
	if err != nil {
		return nil, err
	}

	return page, nil
}