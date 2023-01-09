package app

import (
	"context"
	"crypto/aes"
	"crypto/cipher"
	"crypto/hmac"
	"encoding/base64"
	"encoding/json"
	"io/ioutil"
	"math"
	"strings"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/cognitoidentityprovider"
	"github.com/aws/aws-sdk-go-v2/service/cognitoidentityprovider/types"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/gap-commerce/srv-emberz/pkg/model"
	"github.com/gap-commerce/srv-emberz/pkg/scalar"
	"github.com/google/uuid"
	"golang.org/x/crypto/scrypt"
)

func (a *App) MigrateUser(ctx context.Context, accountID string,
	storeID string, username string, password string) (*bool, error) {

	storeKey := a.GetResourceKey(accountID, storeID, a.Config.StoreKey)

	store, err := a.Services.Store.Get(ctx, storeKey)
	if err != nil {
		return nil, err
	}

	// get user from cognito
	params := &cognitoidentityprovider.AdminGetUserInput{
		UserPoolId: store.AccountSetting.UserPoolsID,
		Username:   aws.String(username),
	}

	cAccount, err := a.Services.Cognito.AdminGetUser(ctx, params)
	if cAccount != nil {
		retry := false
		return &retry, nil
	}

	if err != nil && !strings.Contains(err.Error(), "User does not exist") {
		retry := false
		a.Logger.Error(err)

		return &retry, nil
	}

	//check if user is in firebase
	fAccount, err := a.checkUserExistInFirebase(ctx, a.Config.FireBaseAccountKey, username)
	if err != nil {
		return nil, err
	}

	if fAccount == nil {
		retry := false
		return &retry, nil
	}

	// verify firebase password
	verified := a.verifyFirebasePassword(a.Config.FireBaseSignedKey, password,
		fAccount.PasswordHash, fAccount.Salt, a.Config.FireBaseSaltSeparator, 8, 14)

	if !verified {
		retry := false
		return &retry, nil
	}

	id := uuid.New().String()

	// get account details
	fAccountDetail, err := a.getFireBaseAccountDetail(ctx, fAccount.ID)
	if err != nil {
		return nil, err
	}

	// create account
	err = a.createAccount(ctx, id, username, *fAccountDetail, *store.DynamoOrderTableName)
	if err != nil {
		return nil, err
	}

	// create account in cognito
	err = a.createAccountInCognito(ctx, store.AccountSetting.UserPoolsID,
		accountID, storeID, username, password, id, *fAccount)
	if err != nil {
		return nil, err
	}

	retry := true
	return &retry, nil
}

func (a *App) checkUserExistInFirebase(ctx context.Context,
	key, userName string) (*FirebaseAccount, error) {
	params := &s3.GetObjectInput{
		Bucket: aws.String(a.Config.BucketName),
		Key:    aws.String(key),
	}

	data, err := a.Services.S3.GetObject(ctx, params)
	if err != nil {
		a.Logger.Error(err)
		return nil, err
	}

	d, err := ioutil.ReadAll(data.Body)
	if err != nil {
		a.Logger.Error(err)
		return nil, err
	}

	accounts := make([]FirebaseAccount, 0)

	err = json.Unmarshal(d, &accounts)
	if err != nil {
		a.Logger.Error(err)
		return nil, err
	}

	for _, fA := range accounts {
		if fA.Email == userName {
			return &fA, nil
		}
	}

	return nil, nil
}

func (a *App) verifyFirebasePassword(signerKey string, password string, knowHash string,
	uSalt string, saltSeparator string, rounds int, memCost int) bool {

	dKey := a.generateDerivedKey(password, uSalt, saltSeparator, rounds, memCost)

	result := a.encriptKey(signerKey, dKey)

	passwordHash := base64.StdEncoding.EncodeToString(result)

	v := hmac.Equal([]byte(knowHash), []byte(passwordHash))

	return v
}

func (a *App) generateDerivedKey(password string, uSalt string, saltSeparator string,
	rounds int, memCost int) []byte {
	n := int(math.Pow(2, float64(memCost)))
	p := 1

	salt, _ := base64.StdEncoding.DecodeString(uSalt)
	sSeparator, _ := base64.StdEncoding.DecodeString(saltSeparator)

	salt = append(salt, sSeparator...)

	dKey, _ := scrypt.Key([]byte(password), salt, n, rounds, p, 32)
	return dKey
}

func (a *App) encriptKey(signerKey string, key []byte) []byte {
	sgnKey, _ := base64.StdEncoding.DecodeString(signerKey)

	c, _ := aes.NewCipher(key)

	cipherText := make([]byte, len(sgnKey))

	iv := cipherText[:c.BlockSize()]

	ctrCipher := cipher.NewCTR(c, iv)

	ctrCipher.XORKeyStream(cipherText, sgnKey)

	return cipherText
}

func (a *App) createAccountInCognito(ctx context.Context, userPoolsID *string,
	accountID, storeID, username string,
	password string, userID string, fAccount FirebaseAccount) error {
	// create account in cognito
	cParams := &cognitoidentityprovider.AdminCreateUserInput{
		UserPoolId: userPoolsID,
		Username:   aws.String(username),
		UserAttributes: []types.AttributeType{
			{
				Name:  aws.String("custom:ACCOUNT_ID"),
				Value: aws.String(accountID),
			},
			{
				Name:  aws.String("custom:STORE_ID"),
				Value: aws.String(storeID),
			},
			{
				Name:  aws.String("custom:COUNTRY_CODE"),
				Value: aws.String("US"),
			},
			{
				Name:  aws.String("custom:ACCEPT_MARKETING"),
				Value: aws.String("true"),
			},
			{
				Name:  aws.String("custom:GC_CUSTOMER_ID"),
				Value: aws.String(userID),
			},
			{
				Name:  aws.String("given_name"),
				Value: aws.String(fAccount.Name),
			},
			{
				Name:  aws.String("email"),
				Value: aws.String(fAccount.Email),
			},
			{
				Name:  aws.String("email_verified"),
				Value: aws.String("true"),
			},
		},
	}

	_, err := a.Services.Cognito.AdminCreateUser(ctx, cParams)
	if err != nil {
		a.Logger.Error(err)
		return err
	}

	// set permanent account password
	cPParams := &cognitoidentityprovider.AdminSetUserPasswordInput{
		UserPoolId: userPoolsID,
		Username:   aws.String(username),
		Password:   aws.String(password),
		Permanent:  true,
	}

	_, err = a.Services.Cognito.AdminSetUserPassword(ctx, cPParams)
	if err != nil {
		a.Logger.Error(err)
		return err
	}

	gParams := &cognitoidentityprovider.AdminAddUserToGroupInput{
		GroupName:  aws.String("CUSTOMER"),
		UserPoolId: userPoolsID,
		Username:   aws.String(username),
	}

	_, err = a.Services.Cognito.AdminAddUserToGroup(ctx, gParams)
	if err != nil {
		a.Logger.Error(err)
		return err
	}

	return nil
}

func (a *App) createAccount(ctx context.Context, id string,
	username string, detail FireBaseAccountDetail, tableName string) error {
	aKey := "c#"

	t := scalar.Timestamp(time.Now().UTC().Unix())

	totalOrderExpense := 0
	hasAccount := true

	empty := ""
	account := model.Account{
		EntityID:           &id,
		Key:                &aKey,
		FirstName:          &detail.Name,
		LastName:           &detail.LastName,
		Email:              &username,
		HasAccount:         &hasAccount,
		Phone:              &detail.Phone,
		Address1:           &detail.Address1,
		Address2:           &detail.Address2,
		City:               &detail.City,
		Zip:                &detail.Zip,
		CreatedAt:          &t,
		UpdatedAt:          &t,
		Photo:              &empty, //&detail.SelfieURL
		DriverLicensePhoto: &empty, //&detail.DriverLicenseURL
		TotalOrderExpense:  &totalOrderExpense,
	}

	_, err := a.Services.Account.Upsert(ctx, tableName, account)
	if err != nil {
		a.Logger.Error(err)
		return err
	}
	return nil
}

func (a *App) getFireBaseAccountDetail(ctx context.Context,
	id string) (*FireBaseAccountDetail, error) {
	params := &s3.GetObjectInput{
		Bucket: aws.String(a.Config.BucketName),
		Key:    aws.String(a.Config.FireBaseAccountDetailKey),
	}

	data, err := a.Services.S3.GetObject(ctx, params)
	if err != nil {
		a.Logger.Error(err)
		return nil, err
	}

	d, err := ioutil.ReadAll(data.Body)
	if err != nil {
		a.Logger.Error(err)
		return nil, err
	}

	var firebaseData FirebaseAccountData

	err = json.Unmarshal(d, &firebaseData)
	if err != nil {
		a.Logger.Error(err)
		return nil, err
	}

	if detail, ok := firebaseData.Data[id]; ok {
		return &detail, nil
	}

	return &FireBaseAccountDetail{}, nil
}
