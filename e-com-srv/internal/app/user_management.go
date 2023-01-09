package app

import (
	"context"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/gap-commerce/srv-emberz/pkg/auth"
	"github.com/gap-commerce/srv-emberz/pkg/erp/blaze"
	"github.com/gap-commerce/srv-emberz/pkg/model"
	"github.com/gap-commerce/srv-emberz/pkg/scalar"
	"github.com/go-resty/resty/v2"
	"github.com/google/uuid"
)

func (a *App) ListAccounts(ctx context.Context, accountID string,
	storeID string, cursor *string,
	accountFilter *model.AccountFilter) (*model.AccountCursorPagination, error) {
	storeKey := a.GetResourceKey(accountID, storeID, a.Config.StoreKey)
	store, err := a.Services.Store.Get(ctx, storeKey)
	if err != nil {
		return nil, err
	}

	r, c, err := a.Services.Account.GetAll(ctx, cursor, *store.DynamoOrderTableName, accountFilter)
	if err != nil {
		return nil, err
	}

	return &model.AccountCursorPagination{
		Cursor:   c,
		Accounts: a.MapAccounts(r),
	}, err
}

func (a *App) GetAccount(ctx context.Context, accountID string,
	storeID string, id string) (*model.Account, error) {

	storeKey := a.GetResourceKey(accountID, storeID, a.Config.StoreKey)
	store, err := a.Services.Store.Get(ctx, storeKey)
	if err != nil {
		return nil, err
	}

	return a.Services.Account.Get(ctx, id, *store.DynamoOrderTableName)
}

func (a *App) GetAccountByEmail(ctx context.Context, accountID string,
	storeID string, email string) (*model.Account, error) {
	storeKey := a.GetResourceKey(accountID, storeID, a.Config.StoreKey)
	store, err := a.Services.Store.Get(ctx, storeKey)
	if err != nil {
		return nil, err
	}

	account, err := a.Services.Account.GetByEmail(ctx, email, *store.DynamoOrderTableName)
	if err != nil {
		a.Logger.Error(err)

		return account, nil
	}

	if account == nil {
		return nil, nil
	}

	appKey := a.GetResourceKey(accountID, storeID, a.Config.AppKey)
	blazeApp, err := a.Services.App.GetByHandler(ctx, appKey, "blaze")
	if err != nil {
		a.Logger.Error(err)

		return account, nil
	}

	if blazeApp == nil {
		return account, nil
	}

	bApp := (*blazeApp).(model.Blaze)

	if !*bApp.Status {
		return account, nil
	}

	partnerKey := bApp.PartnerKey
	authKey := bApp.AuthKey
	sandbox := false

	if bApp.Sandbox != nil && *bApp.Sandbox {
		partnerKey = bApp.DevPartnerKey
		authKey = bApp.DevAuthKey
		sandbox = true
	}

	rst := resty.New()

	bSrv := blaze.NewService(rst, blaze.Config{
		PartnerKey: *partnerKey,
		AuthKey:    *authKey,
		Sandbox:    sandbox,
	})

	member, err := bSrv.GetMember(ctx, email)
	if err != nil {
		if !errors.Is(err, blaze.ErrEntityNotFound) {
			a.Logger.Error(err)
		}

		return account, nil
	}

	if member.LoyaltyPoints != nil {
		loyaltyPoints := int(*member.LoyaltyPoints)
		account.LoyaltyPoints = &loyaltyPoints
	}

	return account, nil
}

func (a *App) CreateAccount(ctx context.Context, accountID string, storeID string,
	input model.CreateAccountInput) (*model.Account, error) {
	storeKey := a.GetResourceKey(accountID, storeID, a.Config.StoreKey)
	store, err := a.Services.Store.Get(ctx, storeKey)
	if err != nil {
		return nil, err
	}

	account, err := a.Services.Account.GetByEmail(ctx, input.Email, *store.DynamoOrderTableName)
	if err != nil {
		return nil, err
	}

	if account != nil {
		return nil, errors.New("the provided email address is already associated with an existing user")
	}

	id := uuid.New().String()
	now := scalar.Timestamp(time.Now().Unix())
	key := "c#"

	hasAccount := false
	checkInFromDispensary := true

	account = &model.Account{
		EntityID:              &id,
		Key:                   &key,
		Email:                 &input.Email,
		FirstName:             &input.FirstName,
		LastName:              &input.LastName,
		AcceptMarketing:       input.AcceptMarketing,
		HasAccount:            &hasAccount,
		CheckinFromDispensary: &checkInFromDispensary,
		Phone:                 input.Phone,
		CreatedAt:             &now,
		UpdatedAt:             &now,
		DateOfBirth:           input.DateOfBirth,
	}

	return a.Services.Account.Upsert(ctx, *store.DynamoOrderTableName, *account)
}

func (a *App) UpdateAccount(ctx context.Context,
	accountID string, storeID string,
	input model.UpdateAccountInput) (*model.Account, error) {
	storeKey := a.GetResourceKey(accountID, storeID, a.Config.StoreKey)
	store, err := a.Services.Store.Get(ctx, storeKey)
	if err != nil {
		return nil, err
	}

	account, err := a.Services.Account.GetByEmail(ctx, *input.Email, *store.DynamoOrderTableName)
	if err != nil {
		return nil, err
	}

	account.FirstName = input.FirstName
	account.LastName = input.LastName
	account.DriverLicenseID = input.DriverLicenseID
	account.Phone = input.Phone
	account.City = input.City
	account.CityCode = input.CityCode
	account.Country = input.Country
	account.CountryCode = input.CountryCode
	account.Province = input.Province
	account.ProvinceCode = input.ProvinceCode
	account.Zip = input.Zip
	account.Address1 = input.Address1
	account.Address2 = input.Address2
	account.AcceptMarketing = input.AcceptMarketing
	account.Tags = input.Tags
	account.Latitude = input.Latitude
	account.Longitude = input.Longitude
	account.DriverLicensePhoto = input.DriverLicensePhoto
	account.Photo = input.Photo
	account.DateOfBirth = input.DateOfBirth

	t := scalar.Timestamp(time.Now().Unix())
	account.UpdatedAt = &t

	_, err = a.Services.Account.Upsert(ctx, *store.DynamoOrderTableName, *account)
	if err != nil {
		return nil, err
	}

	return account, nil
}

func (a *App) UploadAccountPhoto(ctx context.Context, accountID string, storeID string, userID string,
	input model.AccountUploadPhotoInput) (*model.UploadAccountPhotoResponse,
	error) {
	t := time.Now().Unix()

	uKey := fmt.Sprintf("%s/%d-%s", userID, t, input.FileName)

	fKey := a.GetResourceKey(accountID, storeID, uKey)

	url, headers, err := a.Services.AccountPhotoUpload.UploadAssetsFile(ctx,
		model.FileUploadInput{
			FileName: &fKey,
			FileType: &input.FileType,
		})

	if err != nil {
		a.Logger.Error(err)
		return nil, err
	}

	return &model.UploadAccountPhotoResponse{
		FileName: fKey,
		URL:      *url,
		Headers:  a.GetHttpHeadersFrom(headers),
	}, nil
}

func (a *App) GetAccountPhoto(ctx context.Context,
	filename string, user *auth.User) (*string, error) {
	if v := strings.Contains(filename, user.ID); !v {
		return nil, errors.New("user dont have access to resource")
	}

	return a.Services.AccountPhotoUpload.GetAssetFile(ctx, filename)
}
