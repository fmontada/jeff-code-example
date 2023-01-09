package resolver

// THIS CODE IS A STARTING POINT ONLY. IT WILL NOT BE UPDATED WITH SCHEMA CHANGES.

import (
	"context"

	"github.com/gap-commerce/srv-emberz/pkg/model"
)

func (r *mutationResolver) CreateLanding(ctx context.Context, accountID string, storeID string, input model.LandingInput) (*model.Landing, error) {
	panic("not implemented")
}

// // foo
func (r *mutationResolver) PublishLanding(ctx context.Context, accountID string, storeID string, input model.LandingInput) (*string, error) {
	panic("not implemented")
}

// // foo
func (r *mutationResolver) UpdateLanding(ctx context.Context, accountID string, storeID string, input model.LandingInput) (*model.Landing, error) {
	panic("not implemented")
}

// // foo
func (r *mutationResolver) DeleteLanding(ctx context.Context, accountID string, storeID string, input model.LandingInput) (*string, error) {
	panic("not implemented")
}

// // foo
func (r *mutationResolver) CreateOption(ctx context.Context, accountID string, storeID string, input model.OptionInput) (*model.Option, error) {
	panic("not implemented")
}

// // foo
func (r *mutationResolver) UpdateOption(ctx context.Context, accountID string, storeID string, input model.OptionInput) (*model.Option, error) {
	panic("not implemented")
}

// // foo
func (r *mutationResolver) DeleteOption(ctx context.Context, accountID string, storeID string, optionID string) (*string, error) {
	panic("not implemented")
}

// // foo
func (r *mutationResolver) SyncFromLeafLogic(ctx context.Context, accountID string, storeID string) (*bool, error) {
	panic("not implemented")
}

// // foo
func (r *mutationResolver) PublishStores(ctx context.Context, accountID string, storeID string) (*string, error) {
	panic("not implemented")
}

// // foo
func (r *mutationResolver) CreateTag(ctx context.Context, accountID string, storeID string, input model.TagInput) (*model.Tag, error) {
	panic("not implemented")
}

// // foo
func (r *mutationResolver) UpdateTag(ctx context.Context, accountID string, storeID string, input model.TagInput) (*model.Tag, error) {
	panic("not implemented")
}

// // foo
func (r *mutationResolver) DeleteTag(ctx context.Context, accountID string, storeID string, input model.TagInput) (*string, error) {
	panic("not implemented")
}

// // foo
func (r *queryResolver) ListLandings(ctx context.Context, accountID string, storeID string) ([]*model.Landing, error) {
	panic("not implemented")
}

// // foo
func (r *queryResolver) GetLanding(ctx context.Context, accountID string, storeID string, landingID string) (*model.Landing, error) {
	panic("not implemented")
}

// // foo
func (r *queryResolver) ListOptions(ctx context.Context, accountID string, storeID string, filter *model.OptionFilterInput) ([]*model.Option, error) {
	panic("not implemented")
}

// // foo
func (r *queryResolver) GetOption(ctx context.Context, accountID string, storeID string, optionID string) (*model.Option, error) {
	panic("not implemented")
}

// // foo
func (r *queryResolver) GetAllReviews(ctx context.Context) ([]*model.Review, error) {
	panic("not implemented")
}

// // foo
func (r *queryResolver) GetReview(ctx context.Context, id string) (*model.Review, error) {
	panic("not implemented")
}

// // foo
func (r *queryResolver) ListTag(ctx context.Context, accountID string, storeID string) ([]*model.Tag, error) {
	panic("not implemented")
}

// // foo
func (r *queryResolver) GetTag(ctx context.Context, accountID string, storeID string, tagID string) (*model.Tag, error) {
	panic("not implemented")
}
