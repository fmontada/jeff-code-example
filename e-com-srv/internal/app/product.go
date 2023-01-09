package app

import (
	"bytes"
	"context"
	"errors"
	"fmt"
	"regexp"
	"strings"
	"text/template"
	"time"

	"github.com/gap-commerce/srv-emberz/pkg/ecommerce/jane"
	"github.com/gap-commerce/srv-emberz/pkg/erp/blaze"
	"github.com/gap-commerce/srv-emberz/pkg/model"
	"github.com/go-resty/resty/v2"
	pkgSlugify "github.com/gosimple/slug"
)

func (a *App) ListDriverInventories(ctx context.Context,
	accountID string, storeID string, inventoryID string) ([]*model.BlazeTerminalInventory, error) {
	appKey := a.GetResourceKey(
		accountID,
		storeID,
		a.Config.AppKey,
	)

	blazeApp, err := a.Services.App.GetByHandler(ctx,
		appKey, "blaze")
	if err != nil {
		a.Logger.Error(err)
		return nil, err
	}

	if blazeApp == nil {
		return nil, errors.New("blaze app is not configured")
	}

	bApp := (*blazeApp).(model.Blaze)

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

	terminals, err := a.getBlazeTerminals(ctx, bSrv)
	if err != nil {
		a.Logger.Error(err)
		return nil, err
	}

	invts := make([]*model.BlazeTerminalInventory, 0)

	for _, terminal := range terminals {
		if terminal.InventoryID == inventoryID && terminal.Status {
			products, err := a.getBlazeEmployeeTerminalInventory(ctx,
				bSrv, terminal.ID)
			if err != nil {
				a.Logger.Error(err)
				return nil, err
			}

			for _, product := range products {
				qty := 0

				for _, quantity := range product.Quantities {
					qty += int(*quantity.Quantity)
				}

				flowerType := ""
				thcValue := float64(0)

				if product.FlowerType != nil {
					flowerType = *product.FlowerType
				}

				if product.Thc != nil {
					thcValue = *product.Thc
				}

				thc := fmt.Sprintf("%s %.2f%%", flowerType, thcValue)

				brand := ""

				if product.Brand != nil {
					brand = product.Brand.Name
				}

				pData := strings.Split(*product.Name, "|")

				tp := ""
				strain := ""

				if len(pData) > 0 {
					brand = strings.TrimSpace(pData[0])
				}

				if len(pData) > 1 {
					strain = strings.TrimSpace(pData[1])
				}

				if len(pData) > 2 {
					tp = strings.TrimSpace(pData[2])
				}

				founded := false

				for i := range invts {
					if invts[i].ID == product.ID {
						founded = true
						break
					}
				}

				if !founded {
					it := &model.BlazeTerminalInventory{
						Thc:    &thc,
						Type:   &tp,
						Qty:    &qty,
						Strain: &strain,
						Brand:  &brand,
						Name:   product.Name,
						ID:     product.ID,
					}

					invts = append(invts, it)
				}
			}
		}
	}

	return invts, nil
}

func (a *App) ListInventories(ctx context.Context,
	accountID string, storeID string) ([]*model.BlazeProductInventory, error) {
	appKey := a.GetResourceKey(
		accountID,
		storeID,
		a.Config.AppKey,
	)

	blazeApp, err := a.Services.App.GetByHandler(ctx,
		appKey, "blaze")
	if err != nil {
		a.Logger.Error(err)
		return nil, err
	}

	if blazeApp == nil {
		return nil, errors.New("blaze app is not configured")
	}

	bApp := (*blazeApp).(model.Blaze)

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

	inventories, err := a.getBlazeInventories(ctx, bSrv)
	if err != nil {
		a.Logger.Error(err)
		return nil, err
	}

	// sort by name
	for i := 0; i < len(inventories)-1; i++ {
		for j := i + 1; j < len(inventories); j++ {
			if strings.Compare(inventories[i].Name, inventories[j].Name) == 1 {
				inventories[i].Name, inventories[j].Name = inventories[j].Name, inventories[i].Name
			}
		}
	}

	return a.MapBlazeInventoryToInventory(inventories), nil
}

func (a *App) getBlazeEmployeeTerminalInventory(ctx context.Context,
	bSrv blaze.Blaze, id string) ([]blaze.SearchProduct, error) {
	products := make([]blaze.SearchProduct, 0)

	start := int32(0)
	limit := int32(400)

	inStock := true

	for {
		rst, err := bSrv.GetInventoryByTerminal(ctx, id, &start, &limit, &inStock)
		if err != nil {
			return nil, err
		}

		if len(rst.Values) == 0 {
			break
		}

		start += limit

		products = append(products, rst.Values...)
	}

	return products, nil
}

func (a *App) getBlazeInventories(ctx context.Context,
	bSrv blaze.Blaze) ([]blaze.Inventory, error) {
	rst, err := bSrv.GetInventories(ctx)
	if err != nil {
		return nil, err
	}

	return rst.Values, nil
}

func (a *App) getBlazeTerminals(ctx context.Context,
	bSrv blaze.Blaze) ([]blaze.Terminal, error) {
	rst, err := bSrv.GetTerminals(ctx)
	if err != nil {
		return nil, err
	}

	return rst.Values, nil
}

func (a *App) GetProductByPath(ctx context.Context,
	accountID string,
	storeID string,
	path string,
) (*model.Product, error) {
	pageKey := a.GetResourceKey(accountID, storeID, a.Config.PageKey)

	page, err := a.Services.Page.GetByTemplate(ctx, model.TemplateProduct, pageKey)
	if err != nil {
		return nil, err
	}

	if page == nil {
		return nil, errors.New("product page template not found")
	}

	if page.Seo == nil || page.Seo.URL == nil || *page.Seo.URL == "" {
		return nil, errors.New("product page seo url is not provided")
	}

	key := a.GetResourceKey(accountID, storeID, a.Config.ProductKey)
	products, err := a.Services.Product.GetAll(ctx, key)
	if err != nil {
		return nil, err
	}

	url := sanitizeTemplateURL(*page.Seo.URL)

	tmpl := template.New("seo_template")

	for i := range products {
		if products[i].Name == nil {
			continue
		}

		if _, err := tmpl.Parse(url); err != nil {
			return nil, err
		}

		var tpl bytes.Buffer

		tmpl.Execute(&tpl, TemplateProduct{Slug: pkgSlugify.Make(*products[i].Name)})

		if tpl.String() == path {
			return &products[i], nil
		}
	}

	return nil, errors.New("product not found")
}

func sanitizeTemplateURL(u string) string {
	replace := func(w string) string {
		u := strings.Title(w)
		return fmt.Sprint(u[:2], ".", u[2:])
	}

	t := regexp.MustCompile(`{{[^{}]*}}`).ReplaceAllStringFunc(strings.ReplaceAll(u, " ", ""), replace)
	return t
}

func (a *App) GetProductReviewFromJane(ctx context.Context, accountID string, storeID string,
	id string) ([]*model.JaneProductReview, error) {
	appKey := a.GetResourceKey(
		accountID,
		storeID,
		a.Config.AppKey,
	)

	janeApp, err := a.Services.App.GetByHandler(ctx,
		appKey, "jane")
	if err != nil {
		a.Logger.Error(err)
		return nil, err
	}

	if janeApp == nil {
		return nil, errors.New("jane app is not configured")
	}

	jApp := (*janeApp).(model.Jane)

	jSrv := jane.NewService(*jApp.AppID,
		*jApp.APIKey,
		*jApp.ProductIndex,
		*jApp.ReviewsIndex,
		*jApp.StoresIndex,
		*jApp.StoreID,
		*jApp.Host,
		*jApp.ClientID,
		*jApp.ClientSecret,
		*jApp.OperationClientID,
		*jApp.OperationClientSecret,
		resty.New())

	jReviews, err := jSrv.GetProductReviews(ctx, id)
	if err != nil {
		a.Logger.Error(err)
		return nil, err
	}

	reviews := make([]*model.JaneProductReview, 0, len(jReviews))

	for i := range jReviews {
		reviews = append(reviews, &model.JaneProductReview{
			HasComment:  jReviews[i].HasComment,
			Rating:      float64(jReviews[i].Rating),
			Avatar:      float64(jReviews[i].Avatar),
			UpvoteCount: float64(jReviews[i].UpvoteCount),
			Nickname:    jReviews[i].Nickname,
			Comment:     jReviews[i].Comment,
			CreatedAt:   jReviews[i].CreatedAt.Format(time.RFC3339),
			UpdatedAt:   jReviews[i].UpdatedAt.Format(time.RFC3339),
		})
	}

	return reviews, nil
}

func (a *App) GetJaneBestBundlePosibility(ctx context.Context, accountID string, storeID string, input []*model.JaneBestProductBundlePosibilityInput) (*model.JaneBestProductBundlePosibility, error) {
	appKey := a.GetResourceKey(
		accountID,
		storeID,
		a.Config.AppKey,
	)

	janeApp, err := a.Services.App.GetByHandler(ctx,
		appKey, "jane")
	if err != nil {
		a.Logger.Error(err)
		return nil, err
	}

	if janeApp == nil {
		return nil, errors.New("jane app is not configured")
	}

	jApp := (*janeApp).(model.Jane)

	jSrv := jane.NewService(*jApp.AppID,
		*jApp.APIKey,
		*jApp.ProductIndex,
		*jApp.ReviewsIndex,
		*jApp.StoresIndex,
		*jApp.StoreID,
		*jApp.Host,
		*jApp.ClientID,
		*jApp.ClientSecret,
		*jApp.OperationClientID,
		*jApp.OperationClientSecret,
		resty.New())

	products := make([]jane.BundlePosibilityRequest, 0, len(input))

	for i := range input {
		products = append(products, jane.BundlePosibilityRequest{
			ProductID: input[i].ProductID,
			Count:     input[i].Count,
			PriceID:   string(input[i].PriceID),
		})
	}

	bundle, err := jSrv.GetBestBundlePosibility(ctx, products)
	if err != nil {
		a.Logger.Error(err)
		return nil, err
	}

	discountableProductsIDs := make([]*string, 0, len(bundle.DiscountableProductIds))

	for i := range bundle.DiscountableProductIds {
		discountableProductsIDs = append(discountableProductsIDs, &bundle.DiscountableProductIds[i])
	}

	return &model.JaneBestProductBundlePosibility{
		Status:                 (*model.JaneBundlePosibilityStatus)(bundle.Status),
		SpecialID:              bundle.SpecialID,
		DiscountableProductIds: discountableProductsIDs,
	}, nil
}
