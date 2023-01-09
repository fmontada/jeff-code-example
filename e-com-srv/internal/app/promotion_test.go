package app

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/gap-commerce/glog/test"
	"github.com/gap-commerce/srv-emberz/pkg/model"
	"github.com/gap-commerce/srv-emberz/pkg/scalar"
	"github.com/gap-commerce/srv-emberz/pkg/services/order"
	"github.com/gap-commerce/srv-emberz/pkg/services/promotion"
	"github.com/gap-commerce/srv-emberz/pkg/services/store"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"io"
	"testing"
	"time"
)

func TestApplyPromoCode(t *testing.T) {
	t.Run("successfully apply promo code", func(t *testing.T) {
		// Given
		t.Skip()
		logger := test.NewLogRecorder()
		c := &AppConfig{}

		bucketName := "test_bucket"

		awsDynamoDB := MockPromotionAWSDynamoDB{}
		awsS3 := NewMockAwsS3(mockStore())
		promotionAwsS3 := MockPromotionAWSS3{}

		srv := Service{
			Order:     order.New(awsDynamoDB),
			Store:     store.New(awsS3, awsDynamoDB, bucketName),
			Promotion: promotion.New(promotionAwsS3, bucketName),
		}

		app := NewApp(srv, *c, logger)

		ctx := context.Background()

		accountID := "account_id"
		storeID := "store_id"
		orderID := "order_id"
		expectedDiscountItem := model.OrderDiscountItem{
			ID:                mockPromotions()[2].ID,
			DiscountType:      mockPromotions()[2].DiscountType,
			DiscountRateType:  mockPromotions()[2].DiscountRateType,
			DiscountApplyType: mockPromotions()[2].DiscountApplyType,
			BlazeID:           mockPromotions()[2].BlazeID,
			PromoCode:         mockPromotions()[2].PromoCode,
			Rate:              mockPromotions()[2].Rate,
		}

		// When
		d, err := app.
			ApplyPromotionCode(ctx,
				accountID, storeID, orderID, *expectedDiscountItem.PromoCode)

		// Then
		require.NoError(t, err)
		require.NotNil(t, d)
		assert.Equal(t, expectedDiscountItem.ID, d.ID)
		assert.Equal(t, expectedDiscountItem.DiscountType, d.DiscountType)
		assert.Equal(t, expectedDiscountItem.DiscountRateType, d.DiscountRateType)
		assert.Equal(t, expectedDiscountItem.DiscountApplyType, d.DiscountApplyType)
		assert.Equal(t, expectedDiscountItem.BlazeID, d.BlazeID)
		assert.Equal(t, expectedDiscountItem.PromoCode, d.PromoCode)
		assert.Equal(t, expectedDiscountItem.Rate, d.Rate)

	})

	t.Run("failed apply promo code, no promo code founded", func(t *testing.T) {
		// Given
		t.Skip()
		logger := test.NewLogRecorder()
		c := &AppConfig{}

		bucketName := "test_bucket"

		awsDynamoDB := MockPromotionAWSDynamoDB{}
		awsS3 := NewMockAwsS3(mockStore())
		promotionAwsS3 := MockPromotionAWSS3{}

		srv := Service{
			Order:     order.New(awsDynamoDB),
			Store:     store.New(awsS3, awsDynamoDB, bucketName),
			Promotion: promotion.New(promotionAwsS3, bucketName),
		}

		app := NewApp(srv, *c, logger)

		ctx := context.Background()

		accountID := "account_id"
		storeID := "store_id"
		orderID := "order_id"
		promoCode := "fake_promo_code"

		// When
		d, err := app.ApplyPromotionCode(ctx, accountID, storeID, orderID, promoCode)

		// Then
		require.Error(t, err)
		require.Nil(t, d)
	})
}

func mockOrder() model.Order {
	id := uuid.New().String()
	key := "d#"
	st := model.OrderStatusTypeAbandonedCart
	d := scalar.Timestamp(time.Now().UTC().Unix())
	subTotalPrice := 1800

	return model.Order{
		EntityID:      &id,
		Key:           &key,
		Status:        &st,
		SubtotalPrice: &subTotalPrice,
		CreatedAt:     &d,
		UpdatedAt:     &d,
	}
}

type MockPromotionAWSDynamoDB struct {
	orders []model.Order
}

func (m MockPromotionAWSDynamoDB) CreateTable(ctx context.Context, params *dynamodb.CreateTableInput, optFns ...func(*dynamodb.Options)) (*dynamodb.CreateTableOutput, error) {
	return nil, nil
}

func (m MockPromotionAWSDynamoDB) UpdateContinuousBackups(ctx context.Context, params *dynamodb.UpdateContinuousBackupsInput, optFns ...func(*dynamodb.Options)) (*dynamodb.UpdateContinuousBackupsOutput, error) {
	return nil, nil
}

func (m MockPromotionAWSDynamoDB) UpdateItem(ctx context.Context, params *dynamodb.UpdateItemInput, optFns ...func(*dynamodb.Options)) (*dynamodb.UpdateItemOutput, error) {
	return nil, nil
}

func (m MockPromotionAWSDynamoDB) PutItem(ctx context.Context, params *dynamodb.PutItemInput, optFns ...func(*dynamodb.Options)) (*dynamodb.PutItemOutput, error) {
	return nil, nil
}

func (m MockPromotionAWSDynamoDB) DeleteItem(ctx context.Context, params *dynamodb.DeleteItemInput, optFns ...func(*dynamodb.Options)) (*dynamodb.DeleteItemOutput, error) {
	return nil, nil
}

func (m MockPromotionAWSDynamoDB) GetItem(ctx context.Context, params *dynamodb.GetItemInput, optFns ...func(*dynamodb.Options)) (*dynamodb.GetItemOutput, error) {
	item, _ := attributevalue.MarshalMap(mockOrder())

	return &dynamodb.GetItemOutput{
		Item: item,
	}, nil
}

func (m MockPromotionAWSDynamoDB) Query(ctx context.Context, params *dynamodb.QueryInput, optFns ...func(*dynamodb.Options)) (*dynamodb.QueryOutput, error) {
	return nil, nil
}

func (m MockPromotionAWSDynamoDB) Scan(ctx context.Context, params *dynamodb.ScanInput, optFns ...func(*dynamodb.Options)) (*dynamodb.ScanOutput, error) {
	return nil, nil
}

func (m MockPromotionAWSDynamoDB) DescribeTable(ctx context.Context, input *dynamodb.DescribeTableInput, f ...func(*dynamodb.Options)) (*dynamodb.DescribeTableOutput, error) {
	return nil, nil
}

func mockPromotions() []model.Promotion {
	promotions := make([]model.Promotion, 0)
	rate := 10
	status := true
	discountRate := model.DiscountRateTypePercentage
	discountType := model.DiscountTypeAmountOffOrder

	for i := 0; i < 3; i++ {
		id := fmt.Sprintf("promo_id_%d", i)
		name := fmt.Sprintf("promo_name_%d", i)
		blazeID := fmt.Sprintf("promo_blaze_id_%d", i)
		promoCode := fmt.Sprintf("promo_code_%d", i)

		priority := i + 10

		discountApply := model.DiscountApplyTypePromotionCode

		if i == 0 {
			discountApply = model.DiscountApplyTypeAutomatically
		}

		pr := model.Promotion{
			ID:                &id,
			Name:              &name,
			Priority:          &priority,
			Rate:              &rate,
			DiscountApplyType: &discountApply,
			DiscountRateType:  &discountRate,
			DiscountType:      &discountType,
			PromoCode:         &promoCode,
			BlazeID:           &blazeID,
			Status:            &status,
		}

		promotions = append(promotions, pr)
	}

	return promotions
}

type MockPromotionAWSS3 struct {
}

func (m MockPromotionAWSS3) GetObject(ctx context.Context, params *s3.GetObjectInput,
	optFns ...func(*s3.Options)) (*s3.GetObjectOutput, error) {
	bs, _ := json.Marshal(mockPromotions())

	reader := bytes.NewReader(bs)
	closer := io.NopCloser(reader)

	return &s3.GetObjectOutput{
		Body: closer,
	}, nil
}

func (m MockPromotionAWSS3) PutObject(ctx context.Context, params *s3.PutObjectInput, optFns ...func(*s3.Options)) (*s3.PutObjectOutput, error) {
	return nil, nil
}

func (m MockPromotionAWSS3) ListObjectsV2(ctx context.Context, params *s3.ListObjectsV2Input, optFns ...func(*s3.Options)) (*s3.ListObjectsV2Output, error) {
	return nil, nil
}

func (m MockPromotionAWSS3) DeleteObject(ctx context.Context, params *s3.DeleteObjectInput, optFns ...func(*s3.Options)) (*s3.DeleteObjectOutput, error) {
	return nil, nil
}

func (m MockPromotionAWSS3) UploadPart(context.Context,
	*s3.UploadPartInput, ...func(*s3.Options)) (*s3.UploadPartOutput, error) {
	return nil, nil
}
func (m MockPromotionAWSS3) CreateMultipartUpload(context.Context,
	*s3.CreateMultipartUploadInput, ...func(*s3.Options)) (*s3.CreateMultipartUploadOutput, error) {
	return nil, nil
}
func (m MockPromotionAWSS3) CompleteMultipartUpload(context.Context,
	*s3.CompleteMultipartUploadInput, ...func(*s3.Options)) (*s3.CompleteMultipartUploadOutput, error) {
	return nil, nil
}
func (m MockPromotionAWSS3) AbortMultipartUpload(context.Context,
	*s3.AbortMultipartUploadInput, ...func(*s3.Options)) (*s3.AbortMultipartUploadOutput, error) {
	return nil, nil
}
