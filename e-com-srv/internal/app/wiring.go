package app

import (
	"context"
	"errors"
	"os"

	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/cognitoidentityprovider"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/aws/aws-sdk-go-v2/service/sns"
	"github.com/gap-commerce/glog/pkg/glog"
	"github.com/gap-commerce/srv-emberz/pkg/auth"
	pkgAccount "github.com/gap-commerce/srv-emberz/pkg/services/account"
	"github.com/gap-commerce/srv-emberz/pkg/services/app"
	bestSelling "github.com/gap-commerce/srv-emberz/pkg/services/best_selling"
	"github.com/gap-commerce/srv-emberz/pkg/services/brand"
	pkgBusinessAccount "github.com/gap-commerce/srv-emberz/pkg/services/businessaccount"
	"github.com/gap-commerce/srv-emberz/pkg/services/category"
	"github.com/gap-commerce/srv-emberz/pkg/services/fileupload"
	inventorySync "github.com/gap-commerce/srv-emberz/pkg/services/inventory_sync"
	"github.com/gap-commerce/srv-emberz/pkg/services/invoice"
	"github.com/gap-commerce/srv-emberz/pkg/services/navigation"
	notification "github.com/gap-commerce/srv-emberz/pkg/services/notification_setting"
	"github.com/gap-commerce/srv-emberz/pkg/services/order"
	"github.com/gap-commerce/srv-emberz/pkg/services/page"
	"github.com/gap-commerce/srv-emberz/pkg/services/product"
	vendor "github.com/gap-commerce/srv-emberz/pkg/services/product_vendor"
	"github.com/gap-commerce/srv-emberz/pkg/services/promotion"
	"github.com/gap-commerce/srv-emberz/pkg/services/store"
	srvUtil "github.com/gap-commerce/srv-utils/pkg/config"
)

const (
	LogLevelEnvVar = "LOG_LEVEL"
	AWSRegion      = "us-west-1"
)

var (
	ErrEnvironmentEnvVarMissing = errors.New("the env environment variable is required")
)

func ConfigFromEnv(
	serviceName,
	version,
	build string,
) (*App, error) {
	ctx := context.Background()

	// logs
	logger := glog.New(glog.Config{
		AppName: serviceName,
		Level:   os.Getenv(LogLevelEnvVar),
	})

	// stats
	//stats := gstattest.NewDevNull()

	awsConfig, err := config.LoadDefaultConfig(ctx, config.WithRegion(AWSRegion))
	if err != nil {
		logger.Error(err)
		return nil, err
	}

	// load config from ssm
	c := &AppConfig{}
	_, err = srvUtil.NewInMemoryConfig(".env", c)

	if err != nil {
		logger.Error(err)
		panic(err)
	}

	c.Version = version
	c.BuildDate = build
	c.LogLevel = os.Getenv(LogLevelEnvVar)
	c.AllowedOrigins = "*"

	valid, err := validateConfig(c)
	if !valid {
		logger.Error(err)
		return nil, err
	}

	// services
	awsS3 := s3.NewFromConfig(awsConfig)
	awsDynamoDB := dynamodb.NewFromConfig(awsConfig)
	awsSns := sns.NewFromConfig(awsConfig)

	// aws cognito
	awsCognito := cognitoidentityprovider.NewFromConfig(awsConfig)

	promotionService := promotion.New(awsS3, c.BucketName)
	categoryService := category.New(awsS3, c.BucketName)
	brandService := brand.New(awsS3, c.BucketName)
	vendorService := vendor.New(awsS3, c.BucketName)
	productService := product.New(awsS3, c.BucketName)

	iSyncService := inventorySync.
		NewBlazeSycService(productService,
			categoryService,
			promotionService,
			brandService,
			vendorService)

	srv := Service{
		Account:             pkgAccount.New(awsDynamoDB),
		Product:             productService,
		Category:            categoryService,
		Promotion:           promotionService,
		App:                 app.New(awsS3, c.BucketName),
		NotificationSetting: notification.New(awsS3, c.BucketName),
		Store:               store.New(awsS3, awsDynamoDB, c.BucketName),
		Page:                page.New(awsS3, c.BucketName),
		Navigation:          navigation.New(awsS3, c.BucketName),
		Brand:               brandService,
		Vendor:              vendorService,
		Order:               order.New(awsDynamoDB),
		Invoice:             invoice.New(awsDynamoDB),
		BestSellingProducts: bestSelling.New(awsS3, c.BucketName),
		FileUpload:          fileupload.NewService(awsS3, c.AssetBucketName),
		AccountPhotoUpload:  fileupload.NewService(awsS3, c.AccountPhotoBucketName),
		InventorySync:       iSyncService,
		SNS:                 awsSns,
		Cognito:             awsCognito,
		S3:                  awsS3,
		DynamoDB:            awsDynamoDB,
		BusinessAccount:     pkgBusinessAccount.New(awsS3, c.BucketName),
	}

	cAuthenticator, err := auth.NewCognitoAuthenticator(awsCognito)

	if err != nil {
		logger.Error(err)
		return nil, err
	}

	app := NewApp(srv, *c, logger, WithAuthenticator(cAuthenticator))
	return app, nil
}

func validateConfig(c *AppConfig) (bool, error) {
	// TODO
	return true, nil
}
