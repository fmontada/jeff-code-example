package app

import (
	"bytes"
	"context"
	"encoding/json"
	"io"
	"testing"
	"time"

	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/gap-commerce/glog/test"
	"github.com/gap-commerce/srv-emberz/pkg/erp/blaze"
	"github.com/gap-commerce/srv-emberz/pkg/model"
	app2 "github.com/gap-commerce/srv-emberz/pkg/services/app"
	"github.com/gap-commerce/srv-emberz/pkg/services/order"
	"github.com/gap-commerce/srv-emberz/pkg/services/promotion"
	"github.com/gap-commerce/srv-emberz/pkg/services/store"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

var findBlazeUser = false

func Test_UpdateCart(t *testing.T) {
	t.Run("it can calculate order summary", func(t *testing.T) {
		// Given
		logger := test.NewLogRecorder()
		c := &AppConfig{
			StoreKey: "store.json",
		}

		awsDynamoDB := MockAWSDynamoDB{}
		awsS3 := NewMockAwsS3(mockStore())
		promotionAwsS3 := MockPromotionAWSS3{}

		srv := Service{
			Store:     store.New(awsS3, awsDynamoDB, c.BucketName),
			Order:     order.New(awsDynamoDB),
			Promotion: promotion.New(promotionAwsS3, c.BucketName),
			App:       app2.New(awsS3, c.BucketName),
		}

		app := NewApp(srv, *c, logger)

		ctx := context.Background()

		ten := 1000
		one := 1

		order := &model.Order{
			LineItems: []*model.LineItem{&model.LineItem{
				Price:    &ten,
				Quantity: &one,
				Variants: []*model.Variant{
					&model.Variant{
						Price: &ten,
					},
				},
			}},
		}

		cd := &model.ClientDetail{
			Device:        nil,
			UserAgent:     nil,
			XForwardedFor: nil,
		}

		// When
		_, err := app.UpdateCart(ctx, "1", "1", order, cd)

		// Then
		require.NoError(t, err)
		assert.Equal(t, 1000, *order.SubtotalPrice)
		assert.Equal(t, 1000, *order.TotalLineItemsPrice)
		assert.Equal(t, 0, *order.TotalDiscounts)
		assert.Equal(t, 100, *order.TotalTax)
		assert.Equal(t, 0, *order.TotalDelivery)
		assert.Equal(t, 1100, *order.TotalPrice)
	})
}

/*
func TestPromotionApply(t *testing.T) {
	t.Run("successfully apply, no first time patient promotion and no limit is set",
		func(t *testing.T) {
			// Given
			t.Skip()
			logger := test.NewLogRecorder()
			c := &AppConfig{}

			subtotal := 1800

			order := model.Order{
				SubtotalPrice: &subtotal,
			}

			id := "promo_id_1"
			name := "promo_name_1"
			priority := 10
			dApply := model.DiscountApplyTypeAutomatically

			promotion := model.Promotion{
				ID:                &id,
				Name:              &name,
				Priority:          &priority,
				DiscountApplyType: &dApply,
			}

			bucketName := "test_bucket"

			awsS3 := MockAppAWSS3{}

			srv := Service{
				App: app2.New(awsS3, bucketName),
			}

			app := NewApp(srv, *c, logger)

			ctx := context.Background()

			// When
			apply := app.checkIfPromotionApply(ctx, promotion, &order, nil)

			// Then
			assert.Equal(t, true, apply)
		})

	t.Run("successfully apply, no first time patient promotion and minimum amount limit is set",
		func(t *testing.T) {
			// Given
			t.Skip()
			logger := test.NewLogRecorder()
			c := &AppConfig{}

			subtotal := 1800

			order := model.Order{
				SubtotalPrice: &subtotal,
			}

			id := "promo_id_1"
			name := "promo_name_1"
			priority := 10
			minimumOrderRequired := true
			minimumOrderAmount := 1700
			dApply := model.DiscountApplyTypeAutomatically

			promotion := model.Promotion{
				ID:                   &id,
				Name:                 &name,
				Priority:             &priority,
				MinimumOrderRequired: &minimumOrderRequired,
				MinimumOrderAmount:   &minimumOrderAmount,
				DiscountApplyType:    &dApply,
			}

			bucketName := "test_bucket"

			awsS3 := MockAppAWSS3{}

			srv := Service{
				App: app2.New(awsS3, bucketName),
			}

			app := NewApp(srv, *c, logger)

			ctx := context.Background()

			// When
			apply := app.checkIfPromotionApply(ctx, promotion, &order, nil)

			// Then
			assert.Equal(t, true, apply)
		})

	t.Run("failed apply, no first time patient promotion and minimum amount limit is set and order subtotal is lower than promotion minimun required",
		func(t *testing.T) {
			// Given
			t.Skip()
			logger := test.NewLogRecorder()
			c := &AppConfig{}

			subtotal := 1600

			order := model.Order{
				SubtotalPrice: &subtotal,
			}

			id := "promo_id_1"
			name := "promo_name_1"
			priority := 10
			minimumOrderRequired := true
			minimumOrderAmount := 1700
			dApply := model.DiscountApplyTypeAutomatically

			promotion := model.Promotion{
				ID:                   &id,
				Name:                 &name,
				Priority:             &priority,
				MinimumOrderRequired: &minimumOrderRequired,
				MinimumOrderAmount:   &minimumOrderAmount,
				DiscountApplyType: &dApply,
			}

			bucketName := "test_bucket"

			awsS3 := MockAppAWSS3{}

			srv := Service{
				App: app2.New(awsS3, bucketName),
			}

			app := NewApp(srv, *c, logger)

			ctx := context.Background()

			// When
			apply := app.checkIfPromotionApply(ctx, promotion, &order, nil)

			// Then
			assert.Equal(t, false, apply)
		})

	t.Run("successfully apply, no first time patient promotion and maximum amount limit is set",
		func(t *testing.T) {
			// Given
			t.Skip()
			logger := test.NewLogRecorder()
			c := &AppConfig{}

			subtotal := 1800

			order := model.Order{
				SubtotalPrice: &subtotal,
			}

			id := "promo_id_1"
			name := "promo_name_1"
			priority := 10
			maximumOrderRequired := true
			maximumOrderAmount := 1850
			dApply := model.DiscountApplyTypeAutomatically

			promotion := model.Promotion{
				ID:                   &id,
				Name:                 &name,
				Priority:             &priority,
				MaximumOrderRequired: &maximumOrderRequired,
				MaximumOrderAmount:   &maximumOrderAmount,
				DiscountApplyType: &dApply,
			}

			bucketName := "test_bucket"

			awsS3 := MockAppAWSS3{}

			srv := Service{
				App: app2.New(awsS3, bucketName),
			}

			app := NewApp(srv, *c, logger)

			ctx := context.Background()

			// When
			apply := app.checkIfPromotionApply(ctx, promotion, &order, nil)

			// Then
			assert.Equal(t, true, apply)
		})

	t.Run("failed apply, no first time patient promotion and maximum amount limit is set and order subtotal is greater than promotion maximum required",
		func(t *testing.T) {
			// Given
			t.Skip()
			logger := test.NewLogRecorder()
			c := &AppConfig{}

			subtotal := 1900

			order := model.Order{
				SubtotalPrice: &subtotal,
			}

			id := "promo_id_1"
			name := "promo_name_1"
			priority := 10
			maximumOrderRequired := true
			maximumOrderAmount := 1850
			dApply := model.DiscountApplyTypeAutomatically

			promotion := model.Promotion{
				ID:                   &id,
				Name:                 &name,
				Priority:             &priority,
				MaximumOrderRequired: &maximumOrderRequired,
				MaximumOrderAmount:   &maximumOrderAmount,
				DiscountApplyType: &dApply,
			}

			bucketName := "test_bucket"

			awsS3 := MockAppAWSS3{}

			srv := Service{
				App: app2.New(awsS3, bucketName),
			}

			app := NewApp(srv, *c, logger)

			ctx := context.Background()

			// When
			apply := app.checkIfPromotionApply(ctx, promotion, &order, nil)

			// Then
			assert.Equal(t, false, apply)
		})

	t.Run("successfully apply, no first time patient promotion and never expire is set",
		func(t *testing.T) {
			// Given
			t.Skip()
			logger := test.NewLogRecorder()
			c := &AppConfig{}

			subtotal := 1800

			order := model.Order{
				SubtotalPrice: &subtotal,
			}

			id := "promo_id_1"
			name := "promo_name_1"
			priority := 10
			neverExpire := true
			dApply := model.DiscountApplyTypeAutomatically

			promotion := model.Promotion{
				ID:          &id,
				Name:        &name,
				Priority:    &priority,
				NeverExpire: &neverExpire,
				DiscountApplyType: &dApply,
			}

			bucketName := "test_bucket"

			awsS3 := MockAppAWSS3{}

			srv := Service{
				App: app2.New(awsS3, bucketName),
			}

			app := NewApp(srv, *c, logger)

			ctx := context.Background()

			// When
			apply := app.checkIfPromotionApply(ctx, promotion, &order, nil)

			// Then
			assert.Equal(t, true, apply)
		})

	t.Run("successfully apply, no first time patient promotion and start date is lower than today",
		func(t *testing.T) {
			// Given
			t.Skip()
			logger := test.NewLogRecorder()
			c := &AppConfig{}

			subtotal := 1800

			order := model.Order{
				SubtotalPrice: &subtotal,
			}

			id := "promo_id_1"
			name := "promo_name_1"
			priority := 10
			startDate := time.Now().Add(-24 * time.Hour).Unix()
			tSD := scalar.Timestamp(startDate)
			dApply := model.DiscountApplyTypeAutomatically

			promotion := model.Promotion{
				ID:        &id,
				Name:      &name,
				Priority:  &priority,
				StartDate: &tSD,
				DiscountApplyType: &dApply,
			}

			bucketName := "test_bucket"

			awsS3 := MockAppAWSS3{}

			srv := Service{
				App: app2.New(awsS3, bucketName),
			}

			app := NewApp(srv, *c, logger)

			ctx := context.Background()

			// When
			apply := app.checkIfPromotionApply(ctx, promotion, &order, nil)

			// Then
			assert.Equal(t, true, apply)
		})

	t.Run("failed apply, startdate is set to tomorrow",
		func(t *testing.T) {
			// Given
			t.Skip()
			logger := test.NewLogRecorder()
			c := &AppConfig{}

			subtotal := 1800

			order := model.Order{
				SubtotalPrice: &subtotal,
			}

			id := "promo_id_1"
			name := "promo_name_1"
			priority := 10
			startDate := time.Now().Add(24 * time.Hour).Unix()
			tSD := scalar.Timestamp(startDate)
			dApply := model.DiscountApplyTypeAutomatically

			promotion := model.Promotion{
				ID:        &id,
				Name:      &name,
				Priority:  &priority,
				StartDate: &tSD,
				DiscountApplyType: &dApply,
			}

			bucketName := "test_bucket"

			awsS3 := MockAppAWSS3{}

			srv := Service{
				App: app2.New(awsS3, bucketName),
			}

			app := NewApp(srv, *c, logger)

			ctx := context.Background()

			// When
			apply := app.checkIfPromotionApply(ctx, promotion, &order, nil)

			// Then
			assert.Equal(t, false, apply)
		})

	t.Run("successfully apply, start date is lower than today and expiration date is greater than today",
		func(t *testing.T) {
			// Given
			t.Skip()
			logger := test.NewLogRecorder()
			c := &AppConfig{}

			subtotal := 1800

			order := model.Order{
				SubtotalPrice: &subtotal,
			}

			id := "promo_id_1"
			name := "promo_name_1"
			priority := 10
			startDate := time.Now().Add(-24 * time.Hour).Unix()
			tSD := scalar.Timestamp(startDate)

			expirationDate := time.Now().AddDate(0, 0, 3).Unix()
			tED := scalar.Timestamp(expirationDate)
			dApply := model.DiscountApplyTypeAutomatically

			promotion := model.Promotion{
				ID:             &id,
				Name:           &name,
				Priority:       &priority,
				StartDate:      &tSD,
				ExpirationDate: &tED,
				DiscountApplyType: &dApply,
			}

			bucketName := "test_bucket"

			awsS3 := MockAppAWSS3{}

			srv := Service{
				App: app2.New(awsS3, bucketName),
			}

			app := NewApp(srv, *c, logger)

			ctx := context.Background()

			// When
			apply := app.checkIfPromotionApply(ctx, promotion, &order, nil)

			// Then
			assert.Equal(t, true, apply)
		})

	t.Run("failed apply, promotion expired",
		func(t *testing.T) {
			// Given
			t.Skip()
			logger := test.NewLogRecorder()
			c := &AppConfig{}

			subtotal := 1800

			order := model.Order{
				SubtotalPrice: &subtotal,
			}

			id := "promo_id_1"
			name := "promo_name_1"
			priority := 10
			startDate := time.Now().Add(-48 * time.Hour).Unix()
			tSD := scalar.Timestamp(startDate)

			expirationDate := time.Now().Add(-24 * time.Hour).Unix()
			tED := scalar.Timestamp(expirationDate)
			dApply := model.DiscountApplyTypeAutomatically

			promotion := model.Promotion{
				ID:             &id,
				Name:           &name,
				Priority:       &priority,
				StartDate:      &tSD,
				ExpirationDate: &tED,
				DiscountApplyType: &dApply,
			}

			bucketName := "test_bucket"

			awsS3 := MockAppAWSS3{}

			srv := Service{
				App: app2.New(awsS3, bucketName),
			}

			app := NewApp(srv, *c, logger)

			ctx := context.Background()

			// When
			apply := app.checkIfPromotionApply(ctx, promotion, &order, nil)

			// Then
			assert.Equal(t, false, apply)
		})

	t.Run("successfully apply, patient first time",
		func(t *testing.T) {
			// Given
			t.Skip()
			logger := test.NewLogRecorder()
			c := &AppConfig{}

			subtotal := 1800
			email := "gc@gmail.com"

			order := model.Order{
				SubtotalPrice: &subtotal,
				Email:         &email,
			}

			id := "promo_id_1"
			name := "promo_name_1"
			priority := 10
			firstTimePatient := true
			dApply := model.DiscountApplyTypeAutomatically

			promotion := model.Promotion{
				ID:               &id,
				Name:             &name,
				Priority:         &priority,
				FirstTimePatient: &firstTimePatient,
				DiscountApplyType: &dApply,
			}

			bucketName := "test_bucket"

			awsS3 := MockAppAWSS3{}

			srv := Service{
				App: app2.New(awsS3, bucketName),
			}

			app := NewApp(srv, *c, logger)

			ctx := context.Background()

			bSrv := MockBlaze{}

			findBlazeUser = false

			// When
			apply := app.checkIfPromotionApply(ctx, promotion, &order, &bSrv)

			// Then
			assert.Equal(t, true, apply)
		})

	t.Run("failed apply, patient founded",
		func(t *testing.T) {
			// Given
			t.Skip()
			logger := test.NewLogRecorder()
			c := &AppConfig{}

			subtotal := 1800
			email := "gc@gmail.com"

			order := model.Order{
				SubtotalPrice: &subtotal,
				Email:         &email,
			}

			id := "promo_id_1"
			name := "promo_name_1"
			priority := 10
			firstTimePatient := true
			dApply := model.DiscountApplyTypeAutomatically

			promotion := model.Promotion{
				ID:               &id,
				Name:             &name,
				Priority:         &priority,
				FirstTimePatient: &firstTimePatient,
				DiscountApplyType: &dApply,
			}

			bucketName := "test_bucket"

			awsS3 := MockAppAWSS3{}

			srv := Service{
				App: app2.New(awsS3, bucketName),
			}

			app := NewApp(srv, *c, logger)

			ctx := context.Background()

			bSrv := MockBlaze{}

			findBlazeUser = true

			// When
			apply := app.checkIfPromotionApply(ctx, promotion, &order, &bSrv)

			// Then
			assert.Equal(t, false, apply)
		})
}
*/

type MockAWSDynamoDB struct {
	orders []model.Order
}

func (m MockAWSDynamoDB) CreateTable(ctx context.Context, params *dynamodb.CreateTableInput, optFns ...func(*dynamodb.Options)) (*dynamodb.CreateTableOutput, error) {
	panic("implement me")
}

func (m MockAWSDynamoDB) UpdateContinuousBackups(ctx context.Context, params *dynamodb.UpdateContinuousBackupsInput, optFns ...func(*dynamodb.Options)) (*dynamodb.UpdateContinuousBackupsOutput, error) {
	panic("implement me")
}

func (m MockAWSDynamoDB) UpdateItem(ctx context.Context, params *dynamodb.UpdateItemInput, optFns ...func(*dynamodb.Options)) (*dynamodb.UpdateItemOutput, error) {
	panic("implement me")
}

func (m MockAWSDynamoDB) PutItem(ctx context.Context, params *dynamodb.PutItemInput, optFns ...func(*dynamodb.Options)) (*dynamodb.PutItemOutput, error) {
	return nil, nil
}

func (m MockAWSDynamoDB) DeleteItem(ctx context.Context, params *dynamodb.DeleteItemInput, optFns ...func(*dynamodb.Options)) (*dynamodb.DeleteItemOutput, error) {
	panic("implement me")
}

func (m MockAWSDynamoDB) GetItem(ctx context.Context, params *dynamodb.GetItemInput, optFns ...func(*dynamodb.Options)) (*dynamodb.GetItemOutput, error) {
	panic("implement me")
}

func (m MockAWSDynamoDB) Query(ctx context.Context, params *dynamodb.QueryInput, optFns ...func(*dynamodb.Options)) (*dynamodb.QueryOutput, error) {
	panic("implement me")
}

func (m MockAWSDynamoDB) Scan(ctx context.Context, params *dynamodb.ScanInput, optFns ...func(*dynamodb.Options)) (*dynamodb.ScanOutput, error) {
	panic("implement me")
}

func (m MockAWSDynamoDB) DescribeTable(ctx context.Context, input *dynamodb.DescribeTableInput, f ...func(*dynamodb.Options)) (*dynamodb.DescribeTableOutput, error) {
	panic("implement me")
}

type MockAwsS3 struct {
	store model.Store
}

func NewMockAwsS3(store model.Store) MockAwsS3 {
	return MockAwsS3{store: store}
}

func (m MockAwsS3) GetObject(ctx context.Context, params *s3.GetObjectInput, optFns ...func(*s3.Options)) (*s3.GetObjectOutput, error) {
	bs, _ := json.Marshal(m.store)

	reader := bytes.NewReader(bs)
	closer := io.NopCloser(reader)

	return &s3.GetObjectOutput{
		Body: closer,
	}, nil
}

func (m MockAwsS3) PutObject(ctx context.Context,
	params *s3.PutObjectInput, optFns ...func(*s3.Options)) (*s3.PutObjectOutput, error) {
	panic("implement me")
}

func (m MockAwsS3) ListObjectsV2(ctx context.Context,
	params *s3.ListObjectsV2Input, optFns ...func(*s3.Options)) (*s3.ListObjectsV2Output, error) {
	panic("implement me")
}

func (m MockAwsS3) DeleteObject(ctx context.Context,
	params *s3.DeleteObjectInput, optFns ...func(*s3.Options)) (*s3.DeleteObjectOutput, error) {
	panic("implement me")
}

func (m MockAwsS3) UploadPart(context.Context,
	*s3.UploadPartInput, ...func(*s3.Options)) (*s3.UploadPartOutput, error) {
	return nil, nil
}
func (m MockAwsS3) CreateMultipartUpload(context.Context,
	*s3.CreateMultipartUploadInput, ...func(*s3.Options)) (*s3.CreateMultipartUploadOutput, error) {
	return nil, nil
}
func (m MockAwsS3) CompleteMultipartUpload(context.Context,
	*s3.CompleteMultipartUploadInput, ...func(*s3.Options)) (*s3.CompleteMultipartUploadOutput, error) {
	return nil, nil
}
func (m MockAwsS3) AbortMultipartUpload(context.Context,
	*s3.AbortMultipartUploadInput, ...func(*s3.Options)) (*s3.AbortMultipartUploadOutput, error) {
	return nil, nil
}

func mockStore() model.Store {
	active := true
	v := model.TaxTypePercentage
	taxAmount := 10
	dynamoOrderTableName := "test_table"

	return model.Store{
		DynamoOrderTableName: &dynamoOrderTableName,
		TaxActive:            &active,
		TaxType:              &v,
		TaxAmmont:            &taxAmount,
	}
}

type MockAppAWSS3 struct {
}

func (m MockAppAWSS3) GetObject(ctx context.Context, params *s3.GetObjectInput, optFns ...func(*s3.Options)) (*s3.GetObjectOutput, error) {
	key := ""
	status := true

	blazeApp := model.Blaze{
		Name:          "",
		Handler:       "blaze",
		Type:          "ERP",
		Status:        &status,
		AuthKey:       &key,
		PartnerKey:    &key,
		DevAuthKey:    &key,
		DevPartnerKey: &key,
	}

	bs, _ := json.Marshal([]model.App{blazeApp})

	reader := bytes.NewReader(bs)
	closer := io.NopCloser(reader)

	return &s3.GetObjectOutput{
		Body: closer,
	}, nil
}

func (m MockAppAWSS3) PutObject(ctx context.Context, params *s3.PutObjectInput, optFns ...func(*s3.Options)) (*s3.PutObjectOutput, error) {
	panic("implement me")
}

func (m MockAppAWSS3) ListObjectsV2(ctx context.Context, params *s3.ListObjectsV2Input, optFns ...func(*s3.Options)) (*s3.ListObjectsV2Output, error) {
	panic("implement me")
}

func (m MockAppAWSS3) DeleteObject(ctx context.Context, params *s3.DeleteObjectInput, optFns ...func(*s3.Options)) (*s3.DeleteObjectOutput, error) {
	panic("implement me")
}

type MockBlaze struct {
}

func (m *MockBlaze) SearchProducts(ctx context.Context,
	start *int32, limit *int32, brandID,
	vendorID, categoryID *string) (*blaze.SearchResultProductWithInfo, error) {
	return nil, nil
}
func (m *MockBlaze) GetProduct(ctx context.Context,
	id string) (*blaze.SearchProduct, error) {
	return nil, nil
}
func (m *MockBlaze) SearchCategories(ctx context.Context,
	start *int32, limit *int32) (*blaze.SearchResultProductCategory, error) {
	return nil, nil
}
func (m *MockBlaze) SearchBrands(ctx context.Context,
	start *int32, limit *int32) (*blaze.SearchResultProductBrand, error) {
	return nil, nil
}
func (m *MockBlaze) SearchVendors(ctx context.Context,
	start *int32, limit *int32) (*blaze.SearchResultVendor, error) {
	return nil, nil
}
func (m *MockBlaze) GetOrderList(ctx context.Context,
	start *int32, limit *int32, startedDate *time.Time,
	endDate *time.Time) (*blaze.SearchResultPurchaseOrderItemResult, error) {
	return nil, nil
}
func (m *MockBlaze) GetVendor(ctx context.Context,
	id string) (*blaze.Vendor, error) {
	return nil, nil
}
func (m *MockBlaze) SearchPromotions(ctx context.Context,
	start *int32, limit *int32) (*blaze.SearchResultPromotion, error) {
	return nil, nil
}
func (m *MockBlaze) RegisterUser(ctx context.Context,
	user blaze.ConsumerCreateRequest) (*blaze.ConsumerUser, error) {
	return nil, nil
}
func (m *MockBlaze) FindUser(ctx context.Context,
	email string, phoneNumber, country *string) (*blaze.ConsumerUser, error) {
	if !findBlazeUser {
		return nil, nil
	}

	return &blaze.ConsumerUser{}, nil
}
func (m *MockBlaze) LoginUser(ctx context.Context,
	r blaze.ConsumerLoginRequest) (*blaze.ConsumerAuthResult, error) {
	return nil, nil
}
func (m *MockBlaze) UpdateUser(ctx context.Context,
	r blaze.ConsumerUser) (*blaze.ConsumerUser, error) {
	return nil, nil
}
func (m *MockBlaze) GetActiveCart(ctx context.Context,
	userID, sessionID string) (*blaze.ConsumerCart, error) {
	return nil, nil
}
func (m *MockBlaze) SubmitCart(ctx context.Context,
	userID, cartID string, c blaze.ConsumerCart) (*blaze.ConsumerCart, error) {
	return nil, nil
}
func (m *MockBlaze) PrepareCart(ctx context.Context, userID string,
	cart blaze.ConsumerCart) (*blaze.ConsumerCart, error) {
	return nil, nil
}

func (m *MockBlaze) GetEmployees(ctx context.Context, isDriver *bool, start *int32,
	limit *int32, id *string) (*blaze.SearchResultEmployeeResult, error) {
	return nil, nil
}

func (m *MockBlaze) GetInventoryByTerminal(ctx context.Context,
	id string, start *int32,
	limit *int32, inStock *bool) (*blaze.SearchResultProductWithInfo, error) {
	return nil, nil
}

func (m *MockBlaze) CreateMember(ctx context.Context,
	me blaze.Member) (*blaze.Member, error) {
	return nil, nil
}

func (m *MockBlaze) GetMember(ctx context.Context, email string) (*blaze.Member, error) {
	return nil, nil
}

func (m *MockBlaze) AssignMember(ctx context.Context,
	r blaze.AddMemberToQueueRequest, q blaze.Queue) (*blaze.Transaction, error) {
	return nil, nil
}

func (m *MockBlaze) PrepareTransactionCart(ctx context.Context,
	id string, t blaze.Transaction) (*blaze.Transaction, error) {
	return nil, nil
}

func (m *MockBlaze) GetInventories(ctx context.Context) (*blaze.ListResultInventory, error) {
	return nil, nil
}

func (m *MockBlaze) GetTerminals(ctx context.Context) (*blaze.ListResultTerminal, error) {
	return nil, nil
}
