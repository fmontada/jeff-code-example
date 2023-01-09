package app

import (
	"context"
	"encoding/json"
	"errors"
	"testing"

	"github.com/gap-commerce/glog/test"
	"github.com/gap-commerce/srv-emberz/pkg/model"
	"github.com/gap-commerce/srv-emberz/pkg/pagination"
	"github.com/gap-commerce/srv-emberz/pkg/services/page"
	"github.com/gap-commerce/srv-emberz/pkg/services/product"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

type pageOperationType string

const (
	successOperation            pageOperationType = "SUCCESS"
	failedNotFoundPageOperation pageOperationType = "FAILED_NOT_PAGE"
	failedNotFoundSEOOperation  pageOperationType = "FAILED_NOT_SEO"
)

func TestGetProduct(t *testing.T) {
	dataTable := []struct {
		Name           string
		ProductService product.Product
		PageService    page.Page
		Path           string
		Expected       *model.Product
		Error          error
	}{
		{
			Name:           "successfully get product by path",
			ProductService: &MockSProductService{},
			PageService: &MockPageService{
				Operation: successOperation,
			},
			Path:     "hello-pacific-stone-805-glue-1g-2-pack-preroll-new",
			Expected: &mockProducts()[0],
			Error:    nil,
		},
		{
			Name:           "successfully get product by path",
			ProductService: &MockSProductService{},
			PageService: &MockPageService{
				Operation: successOperation,
			},
			Path:     "hello-cure-glitter-box-3-5g-new",
			Expected: &mockProducts()[1],
			Error:    nil,
		},
		{
			Name:           "failed get product by path, nof found page product template",
			ProductService: &MockSProductService{},
			PageService: &MockPageService{
				Operation: failedNotFoundPageOperation,
			},
			Path:     "hello-cure-glitter-box-3-5g-new",
			Expected: nil,
			Error:    errors.New("product page template not found"),
		},
		{
			Name:           "failed get product by path, not found seo page product template",
			ProductService: &MockSProductService{},
			PageService: &MockPageService{
				Operation: failedNotFoundSEOOperation,
			},
			Path:     "hello-cure-glitter-box-3-5g-new",
			Expected: nil,
			Error:    errors.New("product page template not found"),
		},
	}

	for _, d := range dataTable {
		t.Run(d.Name, func(t *testing.T) {
			// Given
			logger := test.NewLogRecorder()

			srv := Service{
				Product: d.ProductService,
				Page:    d.PageService,
			}

			app := NewApp(srv, AppConfig{
				ProductKey: "products.json",
				PageKey:    "pages.json",
			}, logger)

			// When
			product, err := app.GetProductByPath(context.Background(), "", "", d.Path)

			// Then
			require.Equal(t, d.Error, err)

			v, _ := json.Marshal(d.Expected)
			ev, _ := json.Marshal(product)
			require.Equal(t, string(v), string(ev))
		})
	}
}

func TestSanitizeSEOURL(t *testing.T) {
	dataTable := []struct {
		URL      string
		Expected string
	}{
		{
			URL:      "hello-{{slug}}-new",
			Expected: "hello-{{.Slug}}-new",
		},
		{
			URL:      "hello-{{ slug }}-new",
			Expected: "hello-{{.Slug}}-new",
		},
	}

	for _, d := range dataTable {
		// Given

		// When
		url := sanitizeTemplateURL(d.URL)

		// Then
		assert.Equal(t, d.Expected, url)
	}
}

func mockProducts() []model.Product {
	id := "1"
	name := "Pacific Stone | 805 Glue | 1G 2-pack Preroll"

	id2 := "2"
	name2 := "CURE | Glitter Box | 3.5G"

	return []model.Product{
		{
			ID:   &id,
			Name: &name,
		},
		{
			ID:   &id2,
			Name: &name2,
		},
	}
}

type MockSProductService struct {
}

func (m *MockSProductService) Create(ctx context.Context, o model.Product, key string) (*model.Product, error) {
	return &model.Product{}, nil
}

func (m *MockSProductService) CreateMultiple(ctx context.Context, o []model.Product, key string) error {
	return nil
}

func (m *MockSProductService) Update(ctx context.Context, o model.Product, key string) (*model.Product, error) {
	return &model.Product{}, nil
}

func (m *MockSProductService) GetAll(ctx context.Context, key string) ([]model.Product, error) {
	return mockProducts(), nil
}

func (m *MockSProductService) Get(ctx context.Context, id, key string) (*model.Product, error) {
	return &model.Product{}, nil
}

func (m *MockSProductService) Delete(ctx context.Context, id, key string) error {
	return nil
}

func (m *MockSProductService) Search(ctx context.Context, pagination product.Pagination, query *string, key string) (*model.ProductConnection, error) {
	return nil, nil
}

type MockPageService struct {
	Operation pageOperationType
}

func (m *MockPageService) Create(ctx context.Context, o model.Page, key string) (*model.Page, error) {
	return nil, nil
}

func (m *MockPageService) CreateMultiple(ctx context.Context, os []model.Page, key string) error {
	return nil
}

func (m *MockPageService) Update(ctx context.Context, o model.Page, key string) (*model.Page, error) {
	return nil, nil
}

func (m *MockPageService) GetAll(ctx context.Context, key string) ([]model.Page, error) {
	return nil, nil
}

func (m *MockPageService) Get(ctx context.Context, id, key string) (*model.Page, error) {
	return nil, nil
}

func (m *MockPageService) GetByTemplate(ctx context.Context, template model.Template, key string) (*model.Page, error) {
	if m.Operation == failedNotFoundPageOperation {
		return nil, nil
	}

	if m.Operation == failedNotFoundSEOOperation {
		return nil, nil
	}

	url := "hello-{{slug}}-new"

	return &model.Page{
		Seo: &model.Seo{
			URL: &url,
		},
	}, nil
}

func (m *MockPageService) ListPagesByTemplate(ctx context.Context, template model.Template, key string, pagination pagination.Pagination) (*model.PageConnection, error) {
	return nil, nil
}

func (m *MockPageService) GetBySlug(ctx context.Context, slug string, key string) (*model.Page, error) {
	panic("implement")
}

func (m *MockPageService) GetByPath(ctx context.Context, slug string, key string) (*model.Page, error) {
	panic("implement")
}

func (m *MockPageService) Delete(ctx context.Context, id, key string) error {
	return nil
}
