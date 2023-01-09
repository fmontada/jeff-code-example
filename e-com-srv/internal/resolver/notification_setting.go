package resolver

import (
	"context"
	"github.com/gap-commerce/srv-ecommerce/internal/app"
	"github.com/gap-commerce/srv-emberz/pkg/model"
)

func (r *mutationResolver) UpdateNotificationSetting(ctx context.Context, input model.NotificationSettingInput) (*model.NotificationSetting, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)

	return r.app.Services.NotificationSetting.Update(ct, r.app.MapNotificationSettingInputToNotificationSetting(input), r.app.Config.NotificationSettingKey)
}

func (r *mutationResolver) UpdateStoreNotificationSetting(ctx context.Context, accountID string, storeID string, input model.NotificationSettingInput) (*model.NotificationSetting, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)

	key := r.app.GetResourceKey(accountID, storeID, r.app.Config.NotificationSettingKey)

	return r.app.Services.NotificationSetting.Update(ct, r.app.MapNotificationSettingInputToNotificationSetting(input), key)
}

func (r *mutationResolver) CreateNotificationSetting(ctx context.Context, input model.NotificationSettingInput) (*model.NotificationSetting, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)

	return r.app.Services.NotificationSetting.Create(ct, r.app.MapNotificationSettingInputToNotificationSetting(input), r.app.Config.NotificationSettingKey)
}

func (r *mutationResolver) SetDefaultNotificationSettings(ctx context.Context, accountID string, storeID string) ([]*model.NotificationSetting, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)

	v, err := r.app.Services.NotificationSetting.GetAll(ct, r.app.Config.NotificationSettingKey, nil)
	if err != nil {
		return nil, err
	}

	key := r.app.GetResourceKey(accountID, storeID, r.app.Config.NotificationSettingKey)

	err = r.app.Services.NotificationSetting.CreateMultiple(ct, v, key)
	if err != nil {
		return nil, err
	}

	return r.app.MapNotificationList(v), err
}

func (r *queryResolver) GetStoreNotificationSetting(ctx context.Context, accountID string, storeID string, handler string) (*model.NotificationSetting, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)

	key := r.app.GetResourceKey(accountID, storeID, r.app.Config.NotificationSettingKey)

	return r.app.Services.NotificationSetting.Get(ct, handler, key)
}

func (r *queryResolver) ListStoreNotificationSettings(ctx context.Context, accountID string, storeID string, typeArg *string) ([]*model.NotificationSetting, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)

	key := r.app.GetResourceKey(accountID, storeID, r.app.Config.NotificationSettingKey)

	v, err := r.app.Services.NotificationSetting.GetAll(ct, key, typeArg)
	if err != nil {
		return nil, err
	}

	return r.app.MapNotificationList(v), err
}

func (r *queryResolver) GetNotificationSetting(ctx context.Context, handler string) (*model.NotificationSetting, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)

	return r.app.Services.NotificationSetting.Get(ct, handler, r.app.Config.NotificationSettingKey)
}

func (r *queryResolver) ListNotificationSettings(ctx context.Context, typeArg *string) ([]*model.NotificationSetting, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)

	v, err := r.app.Services.NotificationSetting.GetAll(ct, r.app.Config.NotificationSettingKey, typeArg)
	if err != nil {
		return nil, err
	}

	return r.app.MapNotificationList(v), err
}
