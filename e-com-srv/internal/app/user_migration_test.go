package app

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	cognito "github.com/aws/aws-sdk-go-v2/service/cognitoidentityprovider"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/gap-commerce/glog/test"
	"github.com/gap-commerce/srv-emberz/pkg/model"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"io"
	"os"
	"testing"
)

func TestUserMigrationService(t *testing.T) {
	t.Run("successfully migrate user", func(t *testing.T) {
		// Given
		t.Skip()
		store := MigrateStore{}
		cg := MigrateUserCognito{}
		s := MigrateUserS3{}
		acc := MigrateUserAccount{}

		logger := test.NewLogRecorder()
		username := "gc"
		password := "Admin123"

		srv := Service{
			Store:   &store,
			Cognito: &cg,
			S3:      &s,
			Account: &acc,
		}

		c := AppConfig{
			FireBaseSaltSeparator: os.Getenv("FIREBASE_SALT_SEPARATOR"),
			FireBaseSignedKey:     os.Getenv("FIREBASE_SIGNED_KEY"),
		}

		app := NewApp(srv, c, logger)

		// When
		ctx := context.Background()
		r, err := app.MigrateUser(ctx, "", "", username, password)

		// Then
		require.NoError(t, err)
		require.NotNil(t, r)
		assert.Equal(t, true, *r)
	})

	t.Run("successfully get account detail", func(t *testing.T) {
		// Given
		s := FirebaseAccountDetailS3{}

		logger := test.NewLogRecorder()
		srv := Service{
			S3: &s,
		}

		c := AppConfig{
			FireBaseSaltSeparator: os.Getenv("FIREBASE_SALT_SEPARATOR"),
			FireBaseSignedKey:     os.Getenv("FIREBASE_SIGNED_KEY"),
		}

		app := NewApp(srv, c, logger)

		id := "2"

		expected := FireBaseAccountDetail{
			LastName:  "gc-lastname2",
			Name:      "gc-name2",
			Phone:     "gc-phone2",
			Address1:  "gc-address2",
			Address2:  "gc-address22",
			City:      "gc-city2",
			Zip:       "gc-zip2",
			SelfieURL: "gc-selfieurl2",
		}

		// When
		ctx := context.Background()
		r, err := app.getFireBaseAccountDetail(ctx, id)

		// Then
		require.NoError(t, err)
		require.NotNil(t, r)
		assert.Equal(t, expected.Name, r.Name)
		assert.Equal(t, expected.LastName, r.LastName)
		assert.Equal(t, expected.City, r.City)
		assert.Equal(t, expected.Address1, r.Address1)
		assert.Equal(t, expected.Address2, r.Address2)
		assert.Equal(t, expected.Phone, r.Phone)
		assert.Equal(t, expected.Zip, r.Zip)
		assert.Equal(t, expected.SelfieURL, r.SelfieURL)
	})

	t.Run("successfully get account detail, get empty account", func(t *testing.T) {
		// Given
		s := FirebaseAccountDetailS3{}

		logger := test.NewLogRecorder()
		srv := Service{
			S3: &s,
		}

		c := AppConfig{
			FireBaseSaltSeparator: os.Getenv("FIREBASE_SALT_SEPARATOR"),
			FireBaseSignedKey:     os.Getenv("FIREBASE_SIGNED_KEY"),
		}

		app := NewApp(srv, c, logger)

		id := "20"

		expected := FireBaseAccountDetail{}

		// When
		ctx := context.Background()
		r, err := app.getFireBaseAccountDetail(ctx, id)

		// Then
		require.NoError(t, err)
		require.NotNil(t, r)
		assert.Equal(t, expected.Name, r.Name)
		assert.Equal(t, expected.LastName, r.LastName)
		assert.Equal(t, expected.City, r.City)
		assert.Equal(t, expected.Address1, r.Address1)
		assert.Equal(t, expected.Address2, r.Address2)
		assert.Equal(t, expected.Phone, r.Phone)
		assert.Equal(t, expected.Zip, r.Zip)
		assert.Equal(t, expected.SelfieURL, r.SelfieURL)
	})

	t.Run("failed migrate user, user not found", func(t *testing.T) {
		// Given
		store := MigrateStore{}
		cg := MigrateUserCognito{}
		s := MigrateUserS3{}
		acc := MigrateUserAccount{}

		logger := test.NewLogRecorder()
		username := "fake"
		password := "Admin123"

		c := AppConfig{
			FireBaseSaltSeparator: os.Getenv("FIREBASE_SALT_SEPARATOR"),
			FireBaseSignedKey:     os.Getenv("FIREBASE_SIGNED_KEY"),
		}

		srv := Service{
			Store:   &store,
			Cognito: &cg,
			S3:      &s,
			Account: &acc,
		}

		app := NewApp(srv, c, logger)

		// When
		ctx := context.Background()
		r, err := app.MigrateUser(ctx, "", "", username, password)

		// Then
		require.NoError(t, err)
		require.NotNil(t, r)
		assert.Equal(t, false, *r)
	})

	t.Run("failed migrate user, already created", func(t *testing.T) {
		// Given
		store := MigrateStore{}
		cg := MigrateUserFoundedCognito{}
		s := MigrateUserS3{}
		acc := MigrateUserAccount{}

		logger := test.NewLogRecorder()
		username := "gc"
		password := "Admin123"

		c := AppConfig{
			FireBaseSaltSeparator: os.Getenv("FIREBASE_SALT_SEPARATOR"),
			FireBaseSignedKey:     os.Getenv("FIREBASE_SIGNED_KEY"),
		}

		srv := Service{
			Store:   &store,
			Cognito: &cg,
			S3:      &s,
			Account: &acc,
		}

		app := NewApp(srv, c, logger)

		// When
		ctx := context.Background()
		r, err := app.MigrateUser(ctx, "", "", username, password)

		// Then
		require.NoError(t, err)
		require.NotNil(t, r)
		assert.Equal(t, false, *r)
	})
}

type MigrateStore struct {
}

func (m *MigrateStore) Create(ctx context.Context, st model.Store,
	accountID, key string, keys []string) (*model.Store, error) {
	return nil, nil
}

func (m *MigrateStore) Update(ctx context.Context, st model.Store,
	key string) (*model.Store, error) {
	return nil, nil
}

func (m *MigrateStore) GetAll(ctx context.Context,
	stKey string) ([]model.Store, error) {
	return nil, nil
}

func (m *MigrateStore) Get(ctx context.Context,
	key string) (*model.Store, error) {
	dn := "table"

	return &model.Store{
		AccountSetting: &model.AccountSetting{
			Active:                nil,
			AutoVerifyEmail:       nil,
			CognitoIdentityPoolID: nil,
			CognitoRegion:         nil,
			UserPoolsID:           nil,
			UserPoolsWebClientID:  nil,
		},
		DynamoOrderTableName: &dn,
	}, nil
}

func (m *MigrateStore) GetByAccount(ctx context.Context, accountId,
	stKey string) ([]model.Store, error) {
	return nil, nil
}
func (m *MigrateStore) Delete(ctx context.Context, key string) error {
	return nil
}

func (m *MigrateStore) GetMenu(ctx context.Context, accountID,
	stKey string, roles []string) ([]model.StoreMenu, error) {
	return nil, nil
}

type MigrateUserCognito struct {
}

func (m *MigrateUserCognito) AdminAddUserToGroup(ctx context.Context,
	params *cognito.AdminAddUserToGroupInput,
	optFns ...func(options *cognito.Options)) (*cognito.AdminAddUserToGroupOutput, error) {
	return nil, nil
}

func (m *MigrateUserCognito) AdminCreateUser(ctx context.Context,
	params *cognito.AdminCreateUserInput,
	optFns ...func(*cognito.Options)) (*cognito.AdminCreateUserOutput, error) {
	return nil, nil
}

func (m *MigrateUserCognito) AdminEnableUser(ctx context.Context,
	params *cognito.AdminEnableUserInput,
	optFns ...func(*cognito.Options)) (*cognito.AdminEnableUserOutput, error) {
	return nil, nil
}

func (m *MigrateUserCognito) AdminDisableUser(ctx context.Context,
	params *cognito.AdminDisableUserInput,
	optFns ...func(*cognito.Options)) (*cognito.AdminDisableUserOutput, error) {
	return nil, nil
}

func (m *MigrateUserCognito) AdminGetUser(ctx context.Context,
	params *cognito.AdminGetUserInput,
	optFns ...func(*cognito.Options)) (*cognito.AdminGetUserOutput, error) {
	return nil, errors.New("User does not exist")
}

func (m *MigrateUserCognito) AdminListGroupsForUser(ctx context.Context,
	params *cognito.AdminListGroupsForUserInput,
	optFns ...func(options *cognito.Options)) (*cognito.AdminListGroupsForUserOutput, error) {
	return nil, nil
}

func (m *MigrateUserCognito) AdminRemoveUserFromGroup(ctx context.Context,
	params *cognito.AdminRemoveUserFromGroupInput,
	optFns ...func(options *cognito.Options)) (*cognito.AdminRemoveUserFromGroupOutput, error) {
	return nil, nil
}

func (m *MigrateUserCognito) AdminUpdateUserAttributes(ctx context.Context,
	params *cognito.AdminUpdateUserAttributesInput,
	optFns ...func(options *cognito.Options)) (*cognito.AdminUpdateUserAttributesOutput, error) {
	return nil, nil
}

func (m *MigrateUserCognito) ListUsers(ctx context.Context,
	params *cognito.ListUsersInput,
	optFns ...func(*cognito.Options)) (*cognito.ListUsersOutput, error) {
	return nil, nil
}

func (m *MigrateUserCognito) GetUser(ctx context.Context,
	params *cognito.GetUserInput,
	optFns ...func(*cognito.Options)) (*cognito.GetUserOutput, error) {
	return nil, nil
}

func (m *MigrateUserCognito) AdminSetUserPassword(ctx context.Context,
	params *cognito.AdminSetUserPasswordInput,
	optFns ...func(*cognito.Options)) (*cognito.AdminSetUserPasswordOutput, error) {
	return nil, nil
}

type MigrateUserS3 struct {
}

func (m *MigrateUserS3) GetObject(ctx context.Context,
	params *s3.GetObjectInput, optFns ...func(*s3.Options)) (*s3.GetObjectOutput, error) {

	fAccounts := []FirebaseAccount{
		{
			Email:        "gc1",
			Name:         "gapcommerce1",
			Phone:        nil,
			PasswordHash: "",
			Salt:         "",
		},

		{
			Email:        "gc",
			Name:         "gapcommerce",
			Phone:        nil,
			PasswordHash: "0B89sQ6tOBUXoK4hUjTk9qQG3QloU+cOER0KhlQ8OuRB/lZFBfnSPzXQu+AXlKAnUmwyCbOSu02WZof7DihJ8g==",
			Salt:         "PX8FnhoP0hrH4w==",
		},
	}

	bs, _ := json.Marshal(fAccounts)

	reader := bytes.NewReader(bs)
	closer := io.NopCloser(reader)

	return &s3.GetObjectOutput{
		Body: closer,
	}, nil
}

func (m *MigrateUserS3) PutObject(ctx context.Context,
	params *s3.PutObjectInput, optFns ...func(*s3.Options)) (*s3.PutObjectOutput, error) {
	return nil, nil
}

func (m *MigrateUserS3) ListObjectsV2(ctx context.Context,
	params *s3.ListObjectsV2Input, optFns ...func(*s3.Options)) (*s3.ListObjectsV2Output, error) {
	return nil, nil
}

func (m *MigrateUserS3) DeleteObject(ctx context.Context, params *s3.DeleteObjectInput,
	optFns ...func(*s3.Options)) (*s3.DeleteObjectOutput, error) {
	return nil, nil
}

func (m MigrateUserS3) UploadPart(context.Context,
	*s3.UploadPartInput, ...func(*s3.Options)) (*s3.UploadPartOutput, error) {
	return nil, nil
}
func (m MigrateUserS3) CreateMultipartUpload(context.Context,
	*s3.CreateMultipartUploadInput, ...func(*s3.Options)) (*s3.CreateMultipartUploadOutput, error) {
	return nil, nil
}
func (m MigrateUserS3) CompleteMultipartUpload(context.Context,
	*s3.CompleteMultipartUploadInput, ...func(*s3.Options)) (*s3.CompleteMultipartUploadOutput, error) {
	return nil, nil
}
func (m MigrateUserS3) AbortMultipartUpload(context.Context,
	*s3.AbortMultipartUploadInput, ...func(*s3.Options)) (*s3.AbortMultipartUploadOutput, error) {
	return nil, nil
}

type FirebaseAccountDetailS3 struct {
}

func (m *FirebaseAccountDetailS3) GetObject(ctx context.Context,
	params *s3.GetObjectInput, optFns ...func(*s3.Options)) (*s3.GetObjectOutput, error) {

	fData := FirebaseAccountData{Data: map[string]FireBaseAccountDetail{
		"1": {
			LastName:  "gc-lastname1",
			Name:      "gc-name1",
			Phone:     "gc-phone1",
			Address1:  "gc-address1",
			Address2:  "gc-address12",
			City:      "gc-city1",
			Zip:       "gc-zip",
			SelfieURL: "gc-selfieurl1",
		},
		"2": {
			LastName:  "gc-lastname2",
			Name:      "gc-name2",
			Phone:     "gc-phone2",
			Address1:  "gc-address2",
			Address2:  "gc-address22",
			City:      "gc-city2",
			Zip:       "gc-zip2",
			SelfieURL: "gc-selfieurl2",
		},
		"3": {
			LastName:  "gc-lastname3",
			Name:      "gc-name3",
			Phone:     "gc-phone3",
			Address1:  "gc-address3",
			Address2:  "gc-address32",
			City:      "gc-city3",
			Zip:       "gc-zip3",
			SelfieURL: "gc-selfieurl3",
		},
	}}

	bs, _ := json.Marshal(fData)

	reader := bytes.NewReader(bs)
	closer := io.NopCloser(reader)

	return &s3.GetObjectOutput{
		Body: closer,
	}, nil
}

func (m *FirebaseAccountDetailS3) PutObject(ctx context.Context,
	params *s3.PutObjectInput, optFns ...func(*s3.Options)) (*s3.PutObjectOutput, error) {
	return nil, nil
}

func (m *FirebaseAccountDetailS3) ListObjectsV2(ctx context.Context,
	params *s3.ListObjectsV2Input, optFns ...func(*s3.Options)) (*s3.ListObjectsV2Output, error) {
	return nil, nil
}

func (m *FirebaseAccountDetailS3) DeleteObject(ctx context.Context, params *s3.DeleteObjectInput,
	optFns ...func(*s3.Options)) (*s3.DeleteObjectOutput, error) {
	return nil, nil
}

func (m FirebaseAccountDetailS3) UploadPart(context.Context,
	*s3.UploadPartInput, ...func(*s3.Options)) (*s3.UploadPartOutput, error) {
	return nil, nil
}
func (m FirebaseAccountDetailS3) CreateMultipartUpload(context.Context,
	*s3.CreateMultipartUploadInput, ...func(*s3.Options)) (*s3.CreateMultipartUploadOutput, error) {
	return nil, nil
}
func (m FirebaseAccountDetailS3) CompleteMultipartUpload(context.Context,
	*s3.CompleteMultipartUploadInput, ...func(*s3.Options)) (*s3.CompleteMultipartUploadOutput, error) {
	return nil, nil
}
func (m FirebaseAccountDetailS3) AbortMultipartUpload(context.Context,
	*s3.AbortMultipartUploadInput, ...func(*s3.Options)) (*s3.AbortMultipartUploadOutput, error) {
	return nil, nil
}

type MigrateUserAccount struct {
}

func (m *MigrateUserAccount) Upsert(ctx context.Context,
	tableName string, i model.Account) (*model.Account, error) {
	return nil, nil
}
func (m *MigrateUserAccount) GetAll(ctx context.Context, cursor *string, tableName string, filter *model.AccountFilter) ([]model.Account,
	*string, error) {
	return nil, nil, nil
}
func (m *MigrateUserAccount) Get(ctx context.Context,
	id, tableName string) (*model.Account, error) {
	return nil, nil
}
func (m *MigrateUserAccount) GetByEmail(ctx context.Context,
	email, tableName string) (*model.Account, error) {
	return nil, nil
}

type MigrateUserFoundedCognito struct {
}

func (m *MigrateUserFoundedCognito) AdminAddUserToGroup(ctx context.Context,
	params *cognito.AdminAddUserToGroupInput,
	optFns ...func(options *cognito.Options)) (*cognito.AdminAddUserToGroupOutput, error) {
	return nil, nil
}

func (m *MigrateUserFoundedCognito) AdminCreateUser(ctx context.Context,
	params *cognito.AdminCreateUserInput,
	optFns ...func(*cognito.Options)) (*cognito.AdminCreateUserOutput, error) {
	return nil, nil
}

func (m *MigrateUserFoundedCognito) AdminEnableUser(ctx context.Context,
	params *cognito.AdminEnableUserInput,
	optFns ...func(*cognito.Options)) (*cognito.AdminEnableUserOutput, error) {
	return nil, nil
}

func (m *MigrateUserFoundedCognito) AdminDisableUser(ctx context.Context,
	params *cognito.AdminDisableUserInput,
	optFns ...func(*cognito.Options)) (*cognito.AdminDisableUserOutput, error) {
	return nil, nil
}

func (m *MigrateUserFoundedCognito) AdminGetUser(ctx context.Context,
	params *cognito.AdminGetUserInput,
	optFns ...func(*cognito.Options)) (*cognito.AdminGetUserOutput, error) {
	uName := "name"

	return &cognito.AdminGetUserOutput{
		Username: &uName,
		Enabled:  true,
	}, nil
}

func (m *MigrateUserFoundedCognito) AdminListGroupsForUser(ctx context.Context,
	params *cognito.AdminListGroupsForUserInput,
	optFns ...func(options *cognito.Options)) (*cognito.AdminListGroupsForUserOutput, error) {
	return nil, nil
}

func (m *MigrateUserFoundedCognito) AdminRemoveUserFromGroup(ctx context.Context,
	params *cognito.AdminRemoveUserFromGroupInput,
	optFns ...func(options *cognito.Options)) (*cognito.AdminRemoveUserFromGroupOutput, error) {
	return nil, nil
}

func (m *MigrateUserFoundedCognito) AdminUpdateUserAttributes(ctx context.Context,
	params *cognito.AdminUpdateUserAttributesInput,
	optFns ...func(options *cognito.Options)) (*cognito.AdminUpdateUserAttributesOutput, error) {
	return nil, nil
}

func (m *MigrateUserFoundedCognito) ListUsers(ctx context.Context,
	params *cognito.ListUsersInput,
	optFns ...func(*cognito.Options)) (*cognito.ListUsersOutput, error) {
	return nil, nil
}

func (m *MigrateUserFoundedCognito) GetUser(ctx context.Context,
	params *cognito.GetUserInput,
	optFns ...func(*cognito.Options)) (*cognito.GetUserOutput, error) {
	return &cognito.GetUserOutput{}, nil
}

func (m *MigrateUserFoundedCognito) AdminSetUserPassword(ctx context.Context,
	params *cognito.AdminSetUserPasswordInput,
	optFns ...func(*cognito.Options)) (*cognito.AdminSetUserPasswordOutput, error) {
	return nil, nil
}

type MigrateUserFailedAccount struct {
}

func (m *MigrateUserFailedAccount) Upsert(ctx context.Context,
	tableName string, i model.Account) (*model.Account, error) {
	return nil, errors.New("cannot upsert account")
}
func (m *MigrateUserFailedAccount) GetAll(ctx context.Context,
	cursor *string, tableName string) ([]model.Account, *string, error) {
	return nil, nil, nil
}
func (m *MigrateUserFailedAccount) Get(ctx context.Context,
	id, tableName string) (*model.Account, error) {
	return nil, nil
}

func (m *MigrateUserFailedAccount) GetByEmail(ctx context.Context,
	email, tableName string) (*model.Account, error) {
	return nil, nil
}
