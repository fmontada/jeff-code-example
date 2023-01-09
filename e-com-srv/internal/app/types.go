package app

import (
	"context"

	"github.com/gap-commerce/srv-emberz/pkg/auth"
	"github.com/gap-commerce/srv-emberz/pkg/scalar"
	bestSelling "github.com/gap-commerce/srv-emberz/pkg/services/best_selling"
	"github.com/gap-commerce/srv-emberz/pkg/services/fileupload"
	inventorySync "github.com/gap-commerce/srv-emberz/pkg/services/inventory_sync"

	"time"

	"github.com/gap-commerce/glog/pkg/glog"
	"github.com/gap-commerce/srv-emberz/pkg/aws"
	"github.com/gap-commerce/srv-emberz/pkg/model"
	pkgAccount "github.com/gap-commerce/srv-emberz/pkg/services/account"
	"github.com/gap-commerce/srv-emberz/pkg/services/app"
	"github.com/gap-commerce/srv-emberz/pkg/services/brand"
	pkgBusinessAccount "github.com/gap-commerce/srv-emberz/pkg/services/businessaccount"
	"github.com/gap-commerce/srv-emberz/pkg/services/category"
	"github.com/gap-commerce/srv-emberz/pkg/services/invoice"
	"github.com/gap-commerce/srv-emberz/pkg/services/navigation"
	notificationSetting "github.com/gap-commerce/srv-emberz/pkg/services/notification_setting"
	"github.com/gap-commerce/srv-emberz/pkg/services/order"
	"github.com/gap-commerce/srv-emberz/pkg/services/page"
	"github.com/gap-commerce/srv-emberz/pkg/services/product"
	vendor "github.com/gap-commerce/srv-emberz/pkg/services/product_vendor"
	"github.com/gap-commerce/srv-emberz/pkg/services/promotion"
	"github.com/gap-commerce/srv-emberz/pkg/services/store"
)

const (
	CtxTimeout           = 5 * time.Minute
	earthRadiusKilometer = 6371
	earthRadiusMiles     = 3958
)

type IApp interface {
	SyncFromBlaze(ctx context.Context, pKey, cKey, promotionKey, brandKey, vendorKey string) error
	SubmitCart(ctx context.Context, accountID, storeID string, entityID string) error
	UpdateCart(
		ctx context.Context,
		accountID,
		storeID string,
		order *model.Order,
		cd *model.ClientDetail,
	) (*model.Order, error)
	GetOrder(ctx context.Context,
		accountID string,
		storeID string,
		entityID string,
	) (*model.Order, error)
	CustomerOrderHistory(
		ctx context.Context,
		accountID string,
		storeID string,
		cursor *string,
		email string,
		totalPrice *int,
	) (*model.OrderCursorPagination, error)
	ListStoreOrders(
		ctx context.Context,
		accountID string,
		storeID string,
		cursor *string,
		status []*string,
	) (*model.OrderCursorPagination, error)
	ListAccounts(ctx context.Context, accountID string,
		storeID string, cursor *string,
		accountFilter *model.AccountFilter) (*model.AccountCursorPagination, error)
	GetAccount(ctx context.Context, accountID string,
		storeID string, id string) (*model.Account, error)
	GetAccountByEmail(ctx context.Context, accountID string,
		storeID string, email string) (*model.Account, error)
	MigrateUser(ctx context.Context, accountID string,
		storeID string, username string, password string) (*bool, error)
	UpdateAccount(ctx context.Context,
		accountID string, storeID string,
		input model.UpdateAccountInput) (*model.Account, error)
	GetDeliveryHubs(ctx context.Context, accountID string,
		storeID string) ([]*model.DeliveryHub, error)
	ListWorkersInLocation(ctx context.Context, accountID string,
		storeID string, location []*float64,
		radius *float64) ([]*model.DeliveryWorker, error)
	GetStats(ctx context.Context, accountID string,
		storeID string) (*model.Stats, error)
}

type AppConfig struct {
	Env                      string `env:"env"`
	Port                     string `env:"port"`
	BucketName               string `env:"aws_s3_bucket_name"`
	AssetBucketName          string `env:"aws_s3_assets_bucket_name"`
	AccountPhotoBucketName   string `env:"aws_s3_account_photo_bucket_name"`
	FireBaseAccountKey       string `env:"firebase_account_key_name"`
	FireBaseAccountDetailKey string `env:"firebase_account_detail_key_name"`
	FireBaseSaltSeparator    string `env:"firebase_salt_separator"`
	FireBaseSignedKey        string `env:"firebase_signed_key"`
	ProductKey               string `env:"aws_s3_product_key_name"`
	PageKey                  string `env:"aws_s3_page_key_name"`
	NavigationKey            string `env:"aws_s3_navigation_key_name"`
	BestSellingProductsKey   string `env:"aws_s3_best_selling_products_key_name"`
	PromotionKey             string `env:"aws_s3_promotion_key_name"`
	CategoryKey              string `env:"aws_s3_category_key_name"`
	NotificationSettingKey   string `env:"aws_s3_notification_setting_key_name"`
	AppKey                   string `env:"aws_s3_app_key_name"`
	StoreKey                 string `env:"aws_s3_store_key_name"`
	TagKey                   string `env:"aws_s3_tag_key_name"`
	LandingPageKey           string `env:"aws_s3_landing_page_key_name"`
	TaxKey                   string `env:"aws_s3_tax_key_name"`
	BrandKey                 string `env:"aws_s3_brand_key_name"`
	VendorKey                string `env:"aws_s3_vendor_key_name"`
	CustomerKey              string `env:"aws_s3_customer_key_name"`
	OrderKey                 string `env:"aws_s3_order_key_name"`
	BusinessAccountKey       string `env:"aws_s3_business_accounts_key_name"`
	CognitoRegion            string `env:"aws_cognito_region"`
	CognitoUserPoolID        string `env:"aws_cognito_user_pool_id"`
	TopicArn                 string `env:"aws_sns_topic"`
	ServiceName              string
	Version                  string
	BuildDate                string
	Environment              string
	LogLevel                 string
	AllowedOrigins           string
}

type App struct {
	Services      Service
	Logger        glog.Logger
	Config        AppConfig
	Authenticator auth.Authenticator
}

type Service struct {
	Product             product.Product
	Category            category.Category
	Promotion           promotion.Promotion
	NotificationSetting notificationSetting.NotificationSetting
	Store               store.Store
	Page                page.Page
	Navigation          navigation.Navigation
	Order               order.Order
	Invoice             invoice.IInvoice
	App                 app.IApp
	Brand               brand.Brand
	Vendor              vendor.Vendor
	Account             pkgAccount.Account
	BestSellingProducts bestSelling.BestSelling
	FileUpload          fileupload.FileUpload
	AccountPhotoUpload  fileupload.FileUpload
	InventorySync       inventorySync.InventorySync
	SNS                 aws.SNS
	S3                  aws.S3
	Cognito             aws.Cognito
	DynamoDB            aws.DynamoDB
	BusinessAccount     pkgBusinessAccount.BusinessAccount
}

type OrderSNSPayload struct {
	AccountID string `json:"account_id"`
	StoreID   string `json:"store_id"`
	EntityID  string `json:"entity_id"`
}

type FirebaseAccount struct {
	ID           string  `json:"localId"`
	Email        string  `json:"email"`
	Name         string  `json:"name"`
	Phone        *string `json:"phoneNumber,omitempty"`
	PasswordHash string  `json:"passwordHash"`
	Salt         string  `json:"salt"`
}

type FireBaseAccountDetail struct {
	LastName         string `json:"last_name"`
	Name             string `json:"name"`
	Phone            string `json:"phone"`
	Address1         string `json:"address1"`
	Address2         string `json:"address2"`
	City             string `json:"city"`
	Zip              string `json:"zip"`
	SelfieURL        string `json:"Selfie_url"`
	DriverLicenseURL string `json:"Id_url"`
}

type FirebaseAccountData struct {
	Data map[string]FireBaseAccountDetail `json:"data"`
}

type SourceData struct {
	EntityID      *string           `json:"entity_id,omitempty" dynamodbav:"entity_id,omitempty"`
	Key           *string           `json:"key,omitempty" dynamodbav:"key,omitempty"`
	SubtotalPrice *int              `json:"subtotal_price,omitempty" dynamodbav:"subtotal_price,omitempty"`
	TotalPrice    *int              `json:"total_price,omitempty" dynamodbav:"total_price,omitempty"`
	CreatedAt     *scalar.Timestamp `json:"created_at,omitempty" dynamodbav:"created_at,omitempty"`
	LineItems     []*model.LineItem `json:"line_items,omitempty" dynamodbav:"line_items,omitempty"`
}

type StatItem struct {
	Month         int
	CustomerCount uint64
	OrderCount    uint64
	OrderTotal    int
	OrderSubtotal int
}

type ContactEmailMessage struct {
	AccountID string `json:"account_id"`
	StoreID   string `json:"store_id"`
	Message   string `json:"message"`
	Name      string `json:"name"`
	Email     string `json:"email"`
}

type TemplateProduct struct {
	Slug string
}

type SubscribeCRM struct {
	model.SubscribeCRMInput
	AccountID string `json:"account_id"`
	StoreID   string `json:"store_id"`
}
