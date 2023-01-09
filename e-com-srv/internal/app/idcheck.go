package app

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/gap-commerce/srv-emberz/pkg/idcheck/berbix"
	berbixPkg "github.com/gap-commerce/srv-emberz/pkg/idcheck/berbix"
	"github.com/gap-commerce/srv-emberz/pkg/model"
	"github.com/go-resty/resty/v2"
)

func (a *App) CreateBerbixClientToken(ctx context.Context, accountID string, storeID string, input model.BerbixClientTokenInput) (*model.BerbixClientToken, error) {
	appKey := a.GetResourceKey(accountID, storeID, a.Config.AppKey)
	berbixApp, err := a.Services.App.GetByHandler(ctx, appKey, "berbix")
	if err != nil {
		a.Logger.Error(err)

		return nil, err
	}

	if berbixApp == nil {
		return nil, errors.New("berbix app not found")
	}

	bApp := (*berbixApp).(model.Berbix)

	berbix := berbix.NewService(resty.New(), bApp.SecretKey, bApp.Template)

	resp, err := berbix.CreateTransaction(ctx, input.UserID)
	if err != nil {
		return nil, err
	}

	return &model.BerbixClientToken{
		AccessToken:  resp.AccessToken,
		ClientToken:  resp.ClientToken,
		RefreshToken: resp.RefreshToken,
		ExpiresAt:    resp.Expires_At.Format(time.RFC3339),
	}, nil
}

func (a *App) GetBerbixTransactionResult(ctx context.Context, accountID string, storeID string, accessToken string, refreshToken string) (*model.BerbixTransactionResult, error) {
	appKey := a.GetResourceKey(accountID, storeID, a.Config.AppKey)
	berbixApp, err := a.Services.App.GetByHandler(ctx, appKey, "berbix")
	if err != nil {
		a.Logger.Error(err)

		return nil, err
	}

	if berbixApp == nil {
		return nil, errors.New("berbix app not found")
	}

	bApp := (*berbixApp).(model.Berbix)

	berbix := berbixPkg.NewService(resty.New(), bApp.SecretKey, bApp.Template)

	resp, err := berbix.GetTransactionResult(ctx, accessToken, refreshToken)
	if err != nil {
		return nil, err
	}

	if resp.Action == berbixPkg.ActionAccept {
		return &model.BerbixTransactionResult{
			ID:            fmt.Sprintf("%d", resp.ID),
			ValitatedUser: true,
		}, nil
	}

	reason := fmt.Sprintf("not validated user reason action %s", resp.Action)

	return &model.BerbixTransactionResult{
		ID:                 fmt.Sprintf("%d", resp.ID),
		ValitatedUser:      false,
		ReasonNotValidated: &reason,
	}, nil
}
