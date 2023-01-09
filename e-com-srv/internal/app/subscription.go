package app

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/gap-commerce/srv-emberz/pkg/model"
	"github.com/gap-commerce/srv-emberz/pkg/scalar"
	"github.com/google/uuid"
)

func (a *App) SubscribeAccount(ctx context.Context, accountID string, storeID string, input model.SubscriptionInput) (*string, error) {
	key := a.GetResourceKey(accountID, storeID, a.Config.StoreKey)

	store, err := a.Services.Store.Get(ctx, key)
	if err != nil {
		a.Logger.Error(err)
		return nil, err
	}

	account, err := a.Services.Account.GetByEmail(ctx, *input.Email, *store.DynamoOrderTableName)
	if err != nil {
		a.Logger.Error(err)
		return nil, err
	}

	if account == nil {
		id := uuid.New().String()
		key := "c#"

		now := time.Now().Unix()
		tNow := scalar.Timestamp(now)
		totalOrderExpense := 0

		account = &model.Account{
			EntityID:          &id,
			Key:               &key,
			Email:             input.Email,
			CreatedAt:         &tNow,
			UpdatedAt:         &tNow,
			TotalOrderExpense: &totalOrderExpense,
		}
	}

	acceptMarketing := true

	account.AcceptMarketing = &acceptMarketing

	if account.Tags == nil {
		tg := "email_subscription"
		account.Tags = &tg
	}

	if !strings.Contains(*account.Tags, "email_subscription") {
		tg := fmt.Sprintf("%s,email_subscription", *account.Tags)
		account.Tags = &tg
	}

	_, err = a.Services.Account.Upsert(ctx, *store.DynamoOrderTableName, *account)
	if err != nil {
		a.Logger.Error(err)
		return nil, err
	}

	return account.EntityID, nil
}
