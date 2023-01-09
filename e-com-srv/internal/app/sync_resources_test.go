package app

import (
	"context"
	"errors"
	"testing"

	"github.com/gap-commerce/glog/test"
	"github.com/gap-commerce/srv-emberz/pkg/model"
	"github.com/gap-commerce/srv-emberz/pkg/services/product"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestApp(t *testing.T) {
	t.Run("successfully sync products from blaze", func(t *testing.T) {
		// Given
		t.Skip()
		expectedProductLength := 2
		expectedCategoriesLength := 2

		prdService := MockProductService{}
		categoryService := MockCategoryService{}
		promotionService := MockPromotionsService{}
		brandService := MockBrandService{}
		vendorService := MockVendorService{}

		logger := test.NewLogRecorder()

		srv := Service{
			Product:   &prdService,
			Category:  &categoryService,
			Promotion: &promotionService,
			Brand:     &brandService,
			Vendor:    &vendorService,
		}

		app := NewApp(srv, AppConfig{}, logger)

		// When
		ctx := context.Background()
		err := app.SyncFromBlaze(ctx, "", "")

		// Then
		require.NoError(t, err)
		assert.Equal(t, expectedProductLength, len(products))
		assert.Equal(t, expectedCategoriesLength, len(categories))
	})

	t.Run("failed sync products from blaze, blaze error", func(t *testing.T) {
		// Given
		t.Skip()
		prdService := MockProductService{}
		categoryService := MockCategoryService{}

		promotionService := MockPromotionsService{}
		brandService := MockBrandService{}
		vendorService := MockVendorService{}

		logger := test.NewLogRecorder()

		srv := Service{
			Product:   &prdService,
			Category:  &categoryService,
			Promotion: &promotionService,
			Brand:     &brandService,
			Vendor:    &vendorService,
		}

		app := NewApp(srv, AppConfig{}, logger)

		// When
		ctx := context.Background()
		err := app.SyncFromBlaze(ctx, "pKey", "")

		// Then
		require.Error(t, err)
		assert.Greater(t, len(logger.Errors), 0)
	})

	t.Run("failed sync products from blaze, products service error", func(t *testing.T) {
		// Given
		t.Skip()
		prdService := MockFailedProductService{}
		categoryService := MockCategoryService{}

		promotionService := MockPromotionsService{}
		brandService := MockBrandService{}
		vendorService := MockVendorService{}

		logger := test.NewLogRecorder()

		srv := Service{
			Product:   &prdService,
			Category:  &categoryService,
			Promotion: &promotionService,

			Brand:  &brandService,
			Vendor: &vendorService,
		}

		app := NewApp(srv, AppConfig{}, logger)

		// When
		ctx := context.Background()
		err := app.SyncFromBlaze(ctx, "pKey", "")

		// Then
		require.Error(t, err)
		assert.Greater(t, len(logger.Errors), 0)
	})

	t.Run("failed sync products from blaze, categories service error", func(t *testing.T) {
		// Given
		t.Skip()
		prdService := MockProductService{}
		categoryService := MockFailedCategoryService{}

		promotionService := MockPromotionsService{}
		brandService := MockBrandService{}
		vendorService := MockVendorService{}

		logger := test.NewLogRecorder()

		srv := Service{
			Product:   &prdService,
			Category:  &categoryService,
			Promotion: &promotionService,

			Brand:  &brandService,
			Vendor: &vendorService,
		}

		app := NewApp(srv, AppConfig{}, logger)

		// When
		ctx := context.Background()
		err := app.SyncFromBlaze(ctx, "pKey", "")

		// Then
		require.Error(t, err)
		assert.Greater(t, len(logger.Errors), 0)
	})

	t.Run("failed sync products from blaze, promotions service error", func(t *testing.T) {
		// Given
		t.Skip()
		prdService := MockProductService{}
		categoryService := MockCategoryService{}

		promotionService := MockFailedPromotionService{}
		brandService := MockBrandService{}
		vendorService := MockVendorService{}

		logger := test.NewLogRecorder()

		srv := Service{
			Product:   &prdService,
			Category:  &categoryService,
			Promotion: &promotionService,

			Brand:  &brandService,
			Vendor: &vendorService,
		}

		app := NewApp(srv, AppConfig{}, logger)

		// When
		ctx := context.Background()
		err := app.SyncFromBlaze(ctx, "pKey", "")

		// Then
		require.Error(t, err)
		assert.Greater(t, len(logger.Errors), 0)
	})

	t.Run("failed sync products from blaze, brand service error", func(t *testing.T) {
		// Given
		t.Skip()
		prdService := MockProductService{}
		categoryService := MockCategoryService{}

		promotionService := MockPromotionsService{}
		brandService := MockFailedBrandService{}
		vendorService := MockVendorService{}

		logger := test.NewLogRecorder()

		srv := Service{
			Product:   &prdService,
			Category:  &categoryService,
			Promotion: &promotionService,

			Brand:  &brandService,
			Vendor: &vendorService,
		}

		app := NewApp(srv, AppConfig{}, logger)

		// When
		ctx := context.Background()
		err := app.SyncFromBlaze(ctx, "pKey", "")

		// Then
		require.Error(t, err)
		assert.Greater(t, len(logger.Errors), 0)
	})

	t.Run("failed sync products from blaze, vendors service error", func(t *testing.T) {
		// Given
		t.Skip()
		prdService := MockProductService{}
		categoryService := MockCategoryService{}

		promotionService := MockPromotionsService{}
		brandService := MockBrandService{}
		vendorService := MockFailedVendorService{}

		logger := test.NewLogRecorder()

		srv := Service{
			Product:   &prdService,
			Category:  &categoryService,
			Promotion: &promotionService,

			Brand:  &brandService,
			Vendor: &vendorService,
		}

		app := NewApp(srv, AppConfig{}, logger)

		// When
		ctx := context.Background()
		err := app.SyncFromBlaze(ctx, "pKey", "")

		// Then
		require.Error(t, err)
		assert.Greater(t, len(logger.Errors), 0)
	})
}

var products []model.Product
var categories []*model.Category

type MockProductService struct {
}

func (m *MockProductService) Create(ctx context.Context, o model.Product, key string) (*model.Product, error) {
	return &model.Product{}, nil
}
func (m *MockProductService) CreateMultiple(ctx context.Context, o []model.Product, key string) error {
	products = o
	return nil
}
func (m *MockProductService) Update(ctx context.Context, o model.Product, key string) (*model.Product, error) {
	return &model.Product{}, nil
}
func (m *MockProductService) GetAll(ctx context.Context, key string) ([]model.Product, error) {
	return []model.Product{}, nil
}
func (m *MockProductService) Get(ctx context.Context, id, key string) (*model.Product, error) {
	return &model.Product{}, nil
}
func (m *MockProductService) Delete(ctx context.Context, id, key string) error {
	return nil
}

func (m *MockProductService) Search(ctx context.Context, pagination product.Pagination, query *string, key string) (*model.ProductConnection, error) {
	return nil, nil
}

type MockCategoryService struct {
}

func (m *MockCategoryService) Create(ctx context.Context, c model.Category, key string) (*model.Category, error) {
	return &model.Category{}, nil
}
func (m *MockCategoryService) Update(ctx context.Context, cat model.Category, key string) (*model.Category, error) {
	return &model.Category{}, nil
}
func (m *MockCategoryService) CreateMultiple(ctx context.Context, o []*model.Category, key string) error {
	categories = o
	return nil
}
func (m *MockCategoryService) GetAll(ctx context.Context, key string) ([]*model.Category, error) {
	return []*model.Category{}, nil
}

func (m *MockCategoryService) Get(ctx context.Context, id, key string) (*model.Category, error) {
	return &model.Category{}, nil
}

func (m *MockCategoryService) Delete(ctx context.Context, id, key string) error {
	return nil
}

type MockBrandService struct {
}

func (m *MockBrandService) GetAll(ctx context.Context, key string) ([]model.Brand, error) {
	return []model.Brand{}, nil
}

func (m *MockBrandService) Get(ctx context.Context, id, key string) (*model.Brand, error) {
	return &model.Brand{}, nil
}

func (m *MockBrandService) CreateMultiple(ctx context.Context, os []model.Brand, key string) error {
	return nil
}

func (m *MockBrandService) Update(ctx context.Context, brand model.Brand, key string) (*model.Brand, error) {
	return nil, nil
}

type MockVendorService struct {
}

func (m *MockVendorService) GetAll(ctx context.Context, key string) ([]model.Vendor, error) {
	return []model.Vendor{}, nil
}

func (m *MockVendorService) Get(ctx context.Context, id, key string) (*model.Vendor, error) {
	return &model.Vendor{}, nil
}

func (m *MockVendorService) CreateMultiple(ctx context.Context, os []model.Vendor, key string) error {
	return nil
}

type MockPromotionsService struct {
}

func (m *MockPromotionsService) Create(ctx context.Context, o model.Promotion, key string) (*model.Promotion, error) {
	return &model.Promotion{}, nil
}

func (m *MockPromotionsService) CreateMultiple(ctx context.Context, o []model.Promotion, key string) error {
	return nil
}

func (m *MockPromotionsService) Update(ctx context.Context, o model.Promotion, key string) (*model.Promotion, error) {
	return &model.Promotion{}, nil
}

func (m *MockPromotionsService) GetAll(ctx context.Context, key string) ([]model.Promotion, error) {
	return []model.Promotion{}, nil
}

func (m *MockPromotionsService) GetActives(ctx context.Context, key string) ([]model.Promotion, error) {
	return []model.Promotion{}, nil
}

func (m *MockPromotionsService) Get(ctx context.Context, id, key string) (*model.Promotion, error) {
	return &model.Promotion{}, nil
}

func (m *MockPromotionsService) GetActive(ctx context.Context, id, key string) (*model.Promotion, error) {
	return &model.Promotion{}, nil
}

func (m *MockPromotionsService) Delete(ctx context.Context, id, key string) error {
	return nil
}

type MockFailedProductService struct {
}

func (m *MockFailedProductService) Create(ctx context.Context, o model.Product, key string) (*model.Product, error) {
	return &model.Product{}, nil
}
func (m *MockFailedProductService) CreateMultiple(ctx context.Context, o []model.Product, key string) error {
	return errors.New("failed to save products")
}
func (m *MockFailedProductService) Update(ctx context.Context, o model.Product, key string) (*model.Product, error) {
	return &model.Product{}, nil
}
func (m *MockFailedProductService) GetAll(ctx context.Context, key string) ([]model.Product, error) {
	return []model.Product{}, nil
}
func (m *MockFailedProductService) Get(ctx context.Context, id, key string) (*model.Product, error) {
	return &model.Product{}, nil
}
func (m *MockFailedProductService) Delete(ctx context.Context, id, key string) error {
	return nil
}

func (m *MockFailedProductService) Search(ctx context.Context, pagination product.Pagination, query *string, key string) (*model.ProductConnection, error) {
	return nil, nil
}

type MockFailedCategoryService struct {
}

func (m *MockFailedCategoryService) Create(ctx context.Context, c model.Category, key string) (*model.Category, error) {
	return &model.Category{}, nil
}
func (m *MockFailedCategoryService) Update(ctx context.Context, cat model.Category, key string) (*model.Category, error) {
	return &model.Category{}, nil
}
func (m *MockFailedCategoryService) CreateMultiple(ctx context.Context, o []*model.Category, key string) error {
	return errors.New("failed to save categories")
}
func (m *MockFailedCategoryService) GetAll(ctx context.Context, key string) ([]*model.Category, error) {
	return []*model.Category{}, nil
}

func (m *MockFailedCategoryService) Get(ctx context.Context, id, key string) (*model.Category, error) {
	return &model.Category{}, nil
}

func (m *MockFailedCategoryService) Delete(ctx context.Context, id, key string) error {
	return nil
}

type MockFailedPromotionService struct {
}

func (m *MockFailedPromotionService) Create(ctx context.Context, o model.Promotion, key string) (*model.Promotion, error) {
	return &model.Promotion{}, nil
}

func (m *MockFailedPromotionService) CreateMultiple(ctx context.Context, o []model.Promotion, key string) error {
	return errors.New("cannot save promotions")
}

func (m *MockFailedPromotionService) Update(ctx context.Context, o model.Promotion, key string) (*model.Promotion, error) {
	return &model.Promotion{}, nil
}

func (m *MockFailedPromotionService) GetAll(ctx context.Context, key string) ([]model.Promotion, error) {
	return []model.Promotion{}, nil
}

func (m *MockFailedPromotionService) GetActives(ctx context.Context, key string) ([]model.Promotion, error) {
	return []model.Promotion{}, nil
}

func (m *MockFailedPromotionService) Get(ctx context.Context, id, key string) (*model.Promotion, error) {
	return &model.Promotion{}, nil
}

func (m *MockFailedPromotionService) GetActive(ctx context.Context, id, key string) (*model.Promotion, error) {
	return &model.Promotion{}, nil
}

func (m *MockFailedPromotionService) Delete(ctx context.Context, id, key string) error {
	return nil
}

type MockFailedBrandService struct {
}

func (m *MockFailedBrandService) GetAll(ctx context.Context, key string) ([]model.Brand, error) {
	return nil, errors.New("cannot get all brands")
}

func (m *MockFailedBrandService) Get(ctx context.Context, id, key string) (*model.Brand, error) {
	return nil, errors.New("cannot get brand")
}

func (m *MockFailedBrandService) CreateMultiple(ctx context.Context, os []model.Brand, key string) error {
	return errors.New("cannot save brands")
}

func (m *MockFailedBrandService) Update(ctx context.Context, brand model.Brand, key string) (*model.Brand, error) {
	return nil, nil
}

type MockFailedVendorService struct {
}

func (m *MockFailedVendorService) GetAll(ctx context.Context, key string) ([]model.Vendor, error) {
	return nil, errors.New("cannot get all vendors")
}

func (m *MockFailedVendorService) Get(ctx context.Context, id, key string) (*model.Vendor, error) {
	return nil, errors.New("cannot get vendors")
}

func (m *MockFailedVendorService) CreateMultiple(ctx context.Context, os []model.Vendor, key string) error {
	return errors.New("cannot save vendors")
}
