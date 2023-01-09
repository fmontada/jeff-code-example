package app

import (
	"fmt"
	"time"

	cognito "github.com/aws/aws-sdk-go-v2/service/cognitoidentityprovider"
	cognitoTypes "github.com/aws/aws-sdk-go-v2/service/cognitoidentityprovider/types"
	"github.com/gap-commerce/srv-emberz/pkg/delivery/onfleet"
	"github.com/gap-commerce/srv-emberz/pkg/ecommerce/jane"
	"github.com/gap-commerce/srv-emberz/pkg/erp/blaze"
	"github.com/gap-commerce/srv-emberz/pkg/model"
	"github.com/gap-commerce/srv-emberz/pkg/scalar"
)

func (a *App) MapProductList(ps []model.Product) []*model.Product {
	prs := make([]*model.Product, 0, len(ps))

	for i := range ps {
		prs = append(prs, &ps[i])
	}

	return prs
}

func (a *App) MapPromotionList(
	ps []model.Promotion) []*model.Promotion {
	promotions := make([]*model.Promotion, 0, len(ps))

	for i := range ps {
		promotions = append(promotions, &ps[i])
	}

	return promotions
}

func (a *App) MapNotificationList(
	ns []model.NotificationSetting) []*model.NotificationSetting {
	notificationSettings := make([]*model.NotificationSetting, 0, len(ns))

	for i := range ns {
		notificationSettings = append(notificationSettings, &ns[i])
	}

	return notificationSettings
}

func (a *App) MapStoreList(
	st []model.Store) []*model.Store {
	stores := make([]*model.Store, 0, len(st))

	for i := range st {
		stores = append(stores, &st[i])
	}

	return stores
}

func (a *App) MapNotificationSettingInputToNotificationSetting(
	i model.NotificationSettingInput) model.NotificationSetting {
	return model.NotificationSetting{
		Type:    i.Type,
		Handler: i.Handler,
		Content: i.Content,
	}
}

func (a *App) MapStoreInputToStore(
	s model.StoreInput) model.Store {
	return model.Store{
		ID:                   s.ID,
		Name:                 s.Name,
		FirstName:            s.FirstName,
		LastName:             s.LastName,
		Email:                s.Email,
		PhoneNumber:          s.PhoneNumber,
		Logo:                 s.Logo,
		LogoSmall:            s.LogoSmall,
		License:              s.License,
		StoreFeature:         a.mapStoreFeatureInputToStoreFeature(s.StoreFeature),
		AccountSetting:       a.mapAccountSettingInputToAccountSetting(s.AccountSetting),
		ShippingSetting:      a.mapShippingSettingInputToShippingSetting(s.ShippingSetting),
		AwsPinpointAnalytics: a.mapAwsAnalyticsInputToAwsAnalytics(s.AwsPinpointAnalytics),
		Address1:             s.Address1,
		Address2:             s.Address2,
		City:                 s.City,
		Country:              s.Country,
		CountryCode:          s.CountryCode,
		CountryName:          s.CountryName,
		Province:             s.Province,
		ProvinceCode:         s.ProvinceCode,
		Zip:                  s.Zip,
		Latitude:             s.Latitude,
		Longitude:            s.Longitude,
		BusinessSlogan:       s.BusinessSlogan,
		BusinessDescription:  s.BusinessDescription,
		MinOrderAmount:       s.MinOrderAmount,
		GtmActive:            s.GtmActive,
		GtmID:                s.GtmID,
		Domain:               s.Domain,
		Instagram:            s.Instagram,
		Facebook:             s.Facebook,
		Twitter:              s.Twitter,
		Yelp:                 s.Yelp,
		Youtube:              s.Youtube,
		Timezone:             s.Timezone,
		MoneyFormat:          s.MoneyFormat,
		Currency:             s.Currency,
		CreatedAt:            s.CreatedAt,
		UpdatedAt:            s.UpdatedAt,
		TaxActive:            s.TaxActive,
		TaxType:              s.TaxType,
		TaxAmmont:            s.TaxAmmont,
		S3Bucket:             s.S3Bucket,
		DynamoOrderTableName: s.DynamoOrderTableName,
		AwsProfile:           s.AwsProfile,
		AwsRegion:            s.AwsRegion,
		Status:               s.Status,
		Medias:               s.Medias,
	}
}

func (a *App) mapStoreFeatureInputToStoreFeature(
	in []*model.StoreFeatureInput) []*model.StoreFeature {
	if in == nil {
		return []*model.StoreFeature{}
	}

	sf := make([]*model.StoreFeature, 0, len(in))

	for i := range in {
		feat := &model.StoreFeature{
			ID:          in[i].ID,
			Status:      in[i].Status,
			Description: in[i].Description,
			Position:    in[i].Position,
		}

		sf = append(sf, feat)
	}

	return sf
}

func (a *App) mapAccountSettingInputToAccountSetting(
	in *model.AccountSettingInput) *model.AccountSetting {
	if in == nil {
		return nil
	}

	return &model.AccountSetting{
		Active:                in.Active,
		AutoVerifyEmail:       in.AutoVerifyEmail,
		CognitoIdentityPoolID: in.CognitoIdentityPoolID,
		CognitoRegion:         in.CognitoRegion,
		UserPoolsID:           in.UserPoolsID,
		UserPoolsWebClientID:  in.UserPoolsWebClientID,
	}
}

func (a *App) mapShippingSettingInputToShippingSetting(
	in *model.ShippingSettingInput) *model.ShippingSetting {
	if in == nil {
		return nil
	}

	var fulfilmentCenter *model.FulfilmentCenter
	var freeShipping *model.FreeShippingMethod
	var flatRate *model.FlatRateMethod
	var storeLevel *model.StoreLevelMethod
	var localDelivery *model.LocalDelivery
	var localPickUp *model.LocalPickUp

	if in.FulfilmentCenter != nil {
		fulfilmentCenter = &model.FulfilmentCenter{
			Address1: in.FulfilmentCenter.Address1,
			Address2: in.FulfilmentCenter.Address2,
			City:     in.FulfilmentCenter.City,
			CityCode: in.FulfilmentCenter.CityCode,
			State:    in.FulfilmentCenter.State,
			Zipcode:  in.FulfilmentCenter.Zipcode,
			Email:    in.FulfilmentCenter.Email,
		}
	}

	if in.FreeShippingMethod != nil {
		regions := a.mapRegionsInputToRegion(in.FreeShippingMethod.Regions)

		freeShipping = &model.FreeShippingMethod{
			Active:             in.FreeShippingMethod.Active,
			Name:               in.FreeShippingMethod.Name,
			Method:             in.FreeShippingMethod.Method,
			AllRegion:          in.FreeShippingMethod.AllRegion,
			Regions:            regions,
			AllZipCodes:        in.FreeShippingMethod.AllZipCodes,
			ZipCodes:           in.FreeShippingMethod.ZipCodes,
			MinimumOrderAmount: in.FreeShippingMethod.MinimumOrderAmount,
			EstimatedDays:      in.FreeShippingMethod.EstimatedDays,
			Sort:               in.FreeShippingMethod.Sort,
		}
	}

	if in.FlatRateMethod != nil {
		regions := a.mapRegionsInputToRegion(in.FlatRateMethod.Regions)

		flatRate = &model.FlatRateMethod{
			Active:             in.FlatRateMethod.Active,
			Name:               in.FlatRateMethod.Name,
			Method:             in.FlatRateMethod.Method,
			ApplyType:          in.FlatRateMethod.ApplyType,
			AllRegion:          in.FlatRateMethod.AllRegion,
			Regions:            regions,
			MinimumOrderAmount: in.FlatRateMethod.MinimumOrderAmount,
			EstimatedDays:      in.FlatRateMethod.EstimatedDays,
			Price:              in.FlatRateMethod.Price,
			Sort:               in.FlatRateMethod.Sort,
		}
	}

	if in.StoreLevelMethod != nil {
		storeLevel = &model.StoreLevelMethod{
			Active:        in.StoreLevelMethod.Active,
			EstimatedDays: in.StoreLevelMethod.EstimatedDays,
		}
	}

	if in.LocalDeliveryMethod != nil {
		localDelivery = &model.LocalDelivery{
			Active:               in.LocalDeliveryMethod.Active,
			MinimumOrderRequired: in.LocalDeliveryMethod.MinimumOrderRequired,
			MinimumOrderAmount:   in.LocalDeliveryMethod.MinimumOrderAmount,
			ZipCodes:             in.LocalDeliveryMethod.ZipCodes,
			Information:          in.LocalDeliveryMethod.Information,
			Price:                in.LocalDeliveryMethod.Price,
			EstimatedDays:        in.LocalDeliveryMethod.EstimatedDays,
		}
	}

	if in.LocalPickupMethod != nil {
		localPickUp = &model.LocalPickUp{
			Active:     in.LocalPickupMethod.Active,
			ZipCodes:   in.LocalPickupMethod.ZipCodes,
			PickupTime: in.LocalPickupMethod.PickupTime,
		}
	}

	return &model.ShippingSetting{
		FulfilmentCenter:    fulfilmentCenter,
		FreeShippingMethod:  freeShipping,
		FlatRateMethod:      flatRate,
		StoreLevelMethod:    storeLevel,
		LocalDeliveryMethod: localDelivery,
		LocalPickupMethod:   localPickUp,
	}
}

func (a *App) mapRegionsInputToRegion(
	rgs []*model.RegionsInput) []*model.Regions {
	regions := make([]*model.Regions, 0, len(rgs))

	for i := range rgs {
		region := &model.Regions{
			Label: rgs[i].Label,
			Value: rgs[i].Value,
		}
		regions = append(regions, region)
	}

	return regions
}

func (a *App) mapAwsAnalyticsInputToAwsAnalytics(
	in *model.AwsPinpointAnalyticsInput) *model.AwsPinpointAnalytics {
	if in == nil {
		return nil
	}

	return &model.AwsPinpointAnalytics{
		Active:         in.Active,
		Region:         in.Region,
		AppID:          in.AppID,
		IdentityPoolID: in.IdentityPoolID,
		AuthRegion:     in.AuthRegion,
	}
}

func (a *App) MapStoreMenuList(ms []model.StoreMenu) []*model.StoreMenu {
	stMenu := make([]*model.StoreMenu, 0, len(ms))

	for i := range ms {
		stMenu = append(stMenu, &ms[i])
	}

	return stMenu
}

func (a *App) MapPageList(ps []model.Page) []*model.Page {
	pages := make([]*model.Page, 0, len(ps))

	for i := range ps {
		pages = append(pages, &ps[i])
	}

	return pages
}

func (a *App) MapPageInputToPage(in model.PageInput) model.Page {
	var seo *model.Seo

	if in.Seo != nil {
		seo = &model.Seo{
			URL:                in.Seo.URL,
			Title:              in.Seo.Title,
			MetaDescription:    in.Seo.MetaDescription,
			IncludeLocalSchema: in.Seo.IncludeLocalSchema,
			MetaRobots:         in.Seo.MetaRobots,
			MetaImage:          in.Seo.MetaImage,
		}
	}

	return model.Page{
		ID:        in.ID,
		Slug:      in.Slug,
		Template:  in.Template,
		CreatedAt: in.CreatedAt,
		UpdatedAt: in.UpdatedAt,
		PublishAt: in.PublishAt,
		Seo:       seo,
		HTMLBody:  in.HTMLBody,
		Status:    in.Status,
		Image:     in.Image,
		Metadata:  in.Metadata,
	}
}

func (a *App) MapNavigationList(ns []model.Navigation) []*model.Navigation {
	navigations := make([]*model.Navigation, 0, len(ns))

	for i := range ns {
		navigations = append(navigations, &ns[i])
	}

	return navigations
}

func (a *App) MapBrandList(bs []model.Brand) []*model.Brand {
	brands := make([]*model.Brand, 0, len(bs))

	for i := range bs {
		brands = append(brands, &bs[i])
	}

	return brands
}

func (a *App) MapVendorList(vs []model.Vendor) []*model.Vendor {
	vendors := make([]*model.Vendor, 0, len(vs))

	for i := range vs {
		vendors = append(vendors, &vs[i])
	}

	return vendors
}

func (a *App) MapNavigationInputToNavigation(in model.NavigationInput) model.Navigation {
	mItems := make([]*model.MenuItem, 0)

	for i := range in.MenuItems {
		mItem := &model.MenuItem{
			ID:               in.MenuItems[i].ID,
			ParentMenuItemID: in.MenuItems[i].ParentMenuItemID,
			Name:             in.MenuItems[i].Name,
			Position:         in.MenuItems[i].Position,
			Target:           in.MenuItems[i].Target,
			URL:              in.MenuItems[i].URL,
		}

		mItems = append(mItems, mItem)
	}

	return model.Navigation{
		ID:        in.ID,
		Title:     in.Title,
		Slug:      in.Slug,
		Status:    in.Status,
		MenuItems: mItems,
	}
}

func (a *App) MapOrderInputToOrder(in model.OrderInput) *model.Order {
	dis := make([]*model.OrderDiscountItem, 0, len(in.DiscountItems))

	for i := range in.DiscountItems {
		di := &model.OrderDiscountItem{
			ID:                &in.DiscountItems[i].ID,
			DiscountType:      &in.DiscountItems[i].DiscountType,
			DiscountRateType:  &in.DiscountItems[i].DiscountRateType,
			DiscountApplyType: in.DiscountItems[i].DiscountApplyType,
			PromoCode:         in.DiscountItems[i].PromoCode,
			Rate:              &in.DiscountItems[i].Rate,
			BlazeID:           in.DiscountItems[i].BlazeID,
		}

		dis = append(dis, di)
	}

	lis := make([]*model.LineItem, 0, len(in.LineItems))

	for i := range in.LineItems {
		variants := make([]*model.Variant, 0, len(in.LineItems[i].Variants))

		for j := range in.LineItems[i].Variants {
			v := model.Variant{
				ID:    in.LineItems[i].Variants[j].ID,
				Name:  in.LineItems[i].Variants[j].Name,
				Price: in.LineItems[i].Variants[j].Price,
				Type:  in.LineItems[i].Variants[j].Type,
			}

			variants = append(variants, &v)
		}

		li := &model.LineItem{
			ItemID:        in.LineItems[i].ItemID,
			ID:            in.LineItems[i].ID,
			Name:          in.LineItems[i].Name,
			Quantity:      in.LineItems[i].Quantity,
			Price:         in.LineItems[i].Price,
			Weight:        in.LineItems[i].Weight,
			Length:        in.LineItems[i].Length,
			Height:        in.LineItems[i].Height,
			Width:         in.LineItems[i].Width,
			ProductWidth:  in.LineItems[i].ProductWidth,
			ProductHeight: in.LineItems[i].ProductHeight,
			WeightUnit:    in.LineItems[i].WeightUnit,
			LengthUnit:    in.LineItems[i].LengthUnit,
			WidthUnit:     in.LineItems[i].WidthUnit,
			HeightUnit:    in.LineItems[i].HeightUnit,
			Thumbnail:     in.LineItems[i].Thumbnail,
			SalePrice:     in.LineItems[i].SalePrice,
			Variants:      variants,
		}

		lis = append(lis, li)
	}

	return &model.Order{
		EntityID:              in.EntityID,
		Key:                   in.Key,
		Status:                in.Status,
		Email:                 in.Email,
		DeliveryAddress:       (*model.OrderAddress)(in.DeliveryAddress),
		DiscountItems:         dis,
		LineItems:             lis,
		Notes:                 in.Notes,
		BuyerAcceptsMarketing: in.BuyerAcceptsMarketing,
		DeliveryDetails:       a.MapOrderDeliveryInputToOrderDelivery(in.DeliveryDetails),
		SubtotalPrice:         in.SubtotalPrice,
		TotalDiscounts:        in.TotalDiscounts,
		TotalLineItemsPrice:   in.TotalLineItemsPrice,
		TotalPrice:            in.TotalPrice,
		TotalTax:              in.TotalTax,
		TotalDelivery:         in.TotalDelivery,
		DateOfBirth:           in.DateOfBirth,
		JaneCartID:            in.JaneCartID,
		JaneOrderID:           in.JaneOrderID,
		TotalServiceFee:       in.TotalServiceFee,
		PaymentDetails:        a.mapOrderPaymentDetals(in.PaymentDetails),
	}
}

func (a *App) mapRoles(rls []*model.Role) []model.Role {
	roles := make([]model.Role, 0, len(rls))

	for i := range rls {
		roles = append(roles, *rls[i])
	}

	return roles
}

func (a *App) MapAccounts(accs []model.Account) []*model.Account {
	accounts := make([]*model.Account, 0, len(accs))

	for i := range accs {
		accounts = append(accounts, &accs[i])
	}

	return accounts
}

func (a *App) MapLeafLogicAppInputToLeafLogixApp(input model.LeafLogixInput) model.LeafLogix {
	return model.LeafLogix{
		ID:             input.ID,
		Name:           input.Name,
		Handler:        input.Handler,
		Type:           input.Type,
		Category:       input.Category,
		CreatedAt:      input.CreatedAt,
		UpdatedAt:      input.UpdatedAt,
		Status:         input.Status,
		InternalAPIKey: input.InternalAPIKey,
	}
}

func (a *App) MapMetafieldInputToMetafield(input model.MetafieldInput) model.Metafield {
	return model.Metafield{
		ID:        input.ID,
		Name:      input.Name,
		Handler:   input.Handler,
		Type:      input.Type,
		Category:  input.Category,
		CreatedAt: input.CreatedAt,
		UpdatedAt: input.UpdatedAt,
		Status:    input.Status,
		Metafield: input.Metafield,
	}
}

func (a *App) MapFacebookCatalogInputFacebook(input model.FacebookCatalogInput) model.FacebookCatalog {
	return model.FacebookCatalog{
		ID:                 input.ID,
		Name:               input.Name,
		Handler:            input.Handler,
		Type:               input.Type,
		Category:           input.Category,
		CreatedAt:          input.CreatedAt,
		UpdatedAt:          input.UpdatedAt,
		Status:             input.Status,
		FacebookCatalogURL: input.FacebookCatalogURL,
	}
}

func (a *App) MapBestSellingProducst(
	ps []model.BestSellingProduct) []*model.BestSellingProduct {
	prs := make([]*model.BestSellingProduct, 0, len(ps))

	for i := range ps {
		prs = append(prs, &ps[i])
	}

	return prs
}

func (a *App) MapOnFleetHubsToHub(hbs []onfleet.Hub) []*model.DeliveryHub {
	hubs := make([]*model.DeliveryHub, 0, len(hbs))

	for i := range hbs {
		location := make([]*float64, 0, len(hbs[i].Location))

		for l := range hbs[i].Location {
			location = append(location, &(hbs[i].Location[l]))
		}

		hub := &model.DeliveryHub{
			ID:       &(hbs[i].ID),
			Name:     &(hbs[i].Name),
			Location: location,
			Address: &model.DeliveryAddress{
				Name:      hbs[i].Address.Name,
				Number:    hbs[i].Address.Number,
				Street:    hbs[i].Address.Street,
				Apartment: hbs[i].Address.Apartment,
				City:      hbs[i].Address.City,
				State:     hbs[i].Address.State,
				Zip:       hbs[i].Address.PostalCode,
				Country:   hbs[i].Address.Country,
			},
		}
		hubs = append(hubs, hub)
	}

	return hubs
}

func (a *App) MapOnFleetWorkersToWorker(wrks []onfleet.Worker) []*model.DeliveryWorker {
	workers := make([]*model.DeliveryWorker, 0, len(wrks))

	for i := range wrks {
		location := make([]*float64, 0, len(wrks[i].Location))

		for l := range wrks[i].Location {
			location = append(location, &(wrks[i].Location[l]))
		}

		worker := &model.DeliveryWorker{
			Name:         &(wrks[i].Name),
			OnDuty:       &(wrks[i].OnDuty),
			Location:     location,
			IsResponding: &(wrks[i].IsResponding),
			Image:        wrks[i].ImageUrl,
		}
		workers = append(workers, worker)
	}

	return workers
}

func (a *App) MapOnFleetDriverETAToDriverETA(name string,
	image *string, estimate onfleet.DriverTimeEstimate) *model.DeliveryEta {
	vhc := model.DeliveryVehicleType(estimate.Vehicle)

	steps := make([]*model.DeliveryETAWorkerStep, 0, len(estimate.Steps))

	for v := range estimate.Steps {
		location := make([]*float64, 0, len(estimate.Steps[v].Location))

		for l := range estimate.Steps[v].Location {
			location = append(location, &(estimate.Steps[v].Location[l]))
		}

		arrv := time.Time(*estimate.Steps[v].ArrivalTime)

		arrivalTime := scalar.Timestamp(arrv.Unix())

		comp := time.Time(*estimate.Steps[v].CompletionTime)

		completionTime := scalar.Timestamp(comp.Unix())

		step := &model.DeliveryETAWorkerStep{
			Distance:       &(estimate.Steps[v].Distance),
			Location:       location,
			ArrivalTime:    &arrivalTime,
			CompletionTime: &completionTime,
		}
		steps = append(steps, step)
	}

	return &model.DeliveryEta{
		WorkerName:  &name,
		WorkerImage: image,
		VehicleType: &vhc,
		Steps:       steps,
	}
}

func (a *App) MapOrderDeliveryInputToOrderDelivery(in *model.OrderDeliveryInput) *model.OrderDelivery {
	var onfleet *model.OnFleetDelivery

	if in.OnFleet != nil {
		onfleet = &model.OnFleetDelivery{
			WorkerName:     in.OnFleet.WorkerName,
			WorkerImage:    in.OnFleet.WorkerImage,
			ID:             in.OnFleet.ID,
			Status:         in.OnFleet.Status,
			TrackingURL:    in.OnFleet.TrackingURL,
			CompleteAfter:  in.OnFleet.CompleteAfter,
			CompleteBefore: in.OnFleet.CompleteBefore,
		}
	}

	return &model.OrderDelivery{
		Delivery:      in.Delivery,
		Pickup:        in.Pickup,
		DeliverAfter:  in.DeliverAfter,
		DeliverBefore: in.DeliverBefore,
		StartedAt:     in.StartedAt,
		FinishedAt:    in.FinishedAt,
		OnFleet:       onfleet,
	}
}

func (a *App) MapBestSellingProductsToStatsTopProducts(bs []model.BestSellingProduct) []*model.TopProductStat {
	topProducts := make([]*model.TopProductStat, 0, len(bs))

	for i := range bs {
		pr := &model.TopProductStat{
			ID:        bs[i].ID,
			Title:     bs[i].Name,
			Qty:       bs[i].Qty,
			Price:     bs[i].UnitPrice,
			Thumbnail: bs[i].Image,
		}

		topProducts = append(topProducts, pr)
	}

	return topProducts
}

func (a *App) MapCognitoUsersToUsers(cUsers []cognitoTypes.UserType) []model.User {
	users := make([]model.User, 0, len(cUsers))

	for _, u := range cUsers {
		st := string(u.UserStatus)
		email := ""
		firstName := ""
		lastName := ""
		accountID := ""
		storeID := ""

		for _, attr := range u.Attributes {
			switch *attr.Name {
			case "email":
				email = *attr.Value
			case "given_name":
				firstName = *attr.Value
			case "family_name":
				lastName = *attr.Value
			case "custom:ACCOUNT_ID":
				accountID = *attr.Value
			case "custom:STORE_ID":
				storeID = *attr.Value
			}
		}

		user := model.User{
			ID:        u.Username,
			FirstName: &firstName,
			LastName:  &lastName,
			Email:     &email,
			AccountID: &accountID,
			StoreID:   &storeID,
			Status:    &st,
			Enabled:   &u.Enabled,
		}

		users = append(users, user)
	}

	return users
}

func (a *App) MapCognitoAdminUserToUser(cUser cognito.AdminGetUserOutput,
	role *string) model.User {
	st := string(cUser.UserStatus)
	email := ""
	firstName := ""
	lastName := ""
	accountID := ""
	storeID := ""

	for _, attr := range cUser.UserAttributes {
		switch *attr.Name {
		case "given_name":
			firstName = *attr.Value
		case "family_name":
			lastName = *attr.Value
		case "custom:ACCOUNT_ID":
			accountID = *attr.Value
		case "custom:STORE_ID":
			storeID = *attr.Value
		}
	}

	user := model.User{
		ID:        cUser.Username,
		FirstName: &firstName,
		LastName:  &lastName,
		Email:     &email,
		AccountID: &accountID,
		StoreID:   &storeID,
		Status:    &st,
		Enabled:   &cUser.Enabled,
		Role:      role,
	}

	return user
}

func (a *App) MapUserInputToUser(u model.UserInput) model.User {
	return model.User{
		ID:        u.ID,
		FirstName: u.FirstName,
		LastName:  u.LastName,
		Username:  u.Username,
		Email:     u.Email,
		Role:      u.Role,
		AccountID: u.AccountID,
		StoreID:   u.StoreID,
		Status:    u.Status,
		Enabled:   u.Enabled,
	}
}

func (a *App) MapUserList(users []model.User) []*model.User {
	mUsers := make([]*model.User, 0, len(users))

	for i := range users {
		mUser := &model.User{
			ID:        users[i].ID,
			FirstName: users[i].FirstName,
			LastName:  users[i].LastName,
			Username:  users[i].Username,
			Email:     users[i].Email,
			Role:      users[i].Role,
			AccountID: users[i].AccountID,
			StoreID:   users[i].StoreID,
			Status:    users[i].Status,
			Enabled:   users[i].Enabled,
		}

		mUsers = append(mUsers, mUser)
	}

	return mUsers
}

func (a *App) MapPromotionInputToPromotion(input model.PromotionInput) model.Promotion {
	return model.Promotion{
		ID:                   input.ID,
		Name:                 input.Name,
		Label:                input.Label,
		NeverExpire:          input.NeverExpire,
		StartDate:            input.StartDate,
		ExpirationDate:       input.ExpirationDate,
		Priority:             input.Priority,
		Broadcast:            input.Broadcast,
		BroadcastType:        input.BroadcastType,
		BroadcastColor:       input.BroadcastColor,
		DiscountType:         input.DiscountType,
		DiscountRateType:     input.DiscountRateType,
		Rate:                 input.Rate,
		DiscountApplyType:    input.DiscountApplyType,
		PromoCode:            input.PromoCode,
		MinimumOrderRequired: input.MinimumOrderRequired,
		MinimumOrderAmount:   input.MinimumOrderAmount,
		MaximumOrderRequired: input.MaximumOrderRequired,
		MaximumOrderAmount:   input.MaximumOrderAmount,
		ProductsID:           input.ProductsID,
		Status:               input.Status,
		BlazeID:              input.BlazeID,
	}
}

func (a *App) MapBlazeInventoryToInventory(is []blaze.Inventory) []*model.BlazeProductInventory {
	inventories := make([]*model.BlazeProductInventory, 0, len(is))

	for i := range is {
		inv := &model.BlazeProductInventory{
			ID:   &is[i].ID,
			Name: &is[i].Name,
		}

		inventories = append(inventories, inv)
	}

	return inventories
}

func (a *App) MapInputBrandToBrand(in model.BrandInput) model.Brand {
	var asset *model.Asset

	if in.Asset != nil {
		asset = &model.Asset{
			Thumbnail:           in.Asset.Thumbnail,
			Image:               in.Asset.Image,
			ImageLargeSize:      in.Asset.ImageLargeSize,
			ImageMediumSize:     in.Asset.ImageMediumSize,
			ImageExtraLargeSize: in.Asset.ImageExtraLargeSize,
		}
	}

	return model.Brand{
		ID:          in.ID,
		Name:        in.Name,
		PhoneNumber: in.PhoneNumber,
		Enabled:     in.Enabled,
		CreatedAt:   in.CreatedAt,
		UpdatedAt:   in.UpdatedAt,
		Website:     in.Website,
		Vendors:     in.Vendors,
		Asset:       asset,
	}
}

func (a *App) MapProductInput(input model.ProductInput) model.Product {
	product := model.Product{
		ID:                input.ID,
		Sku:               input.Sku,
		Name:              input.Name,
		Enabled:           input.Enabled,
		Description:       input.Description,
		Category:          input.Description,
		CategoryID:        input.Category,
		CannabisType:      input.CannabisType,
		ProductType:       input.ProductType,
		ProductSaleType:   input.ProductSaleType,
		FlowerType:        input.FlowerType,
		InStock:           input.InStock,
		Tags:              input.Tags,
		Vendors:           input.Vendors,
		CreatedAt:         input.CreatedAt,
		UpdatedAt:         input.UpdatedAt,
		MedicalConditions: input.MedicalConditions,
		Qty:               input.Qty,
		UnitPrice:         input.UnitPrice,
		SalesPrice:        input.SalesPrice,
		DiscountEnabled:   input.DiscountEnabled,
		Medicinal:         input.Medicinal,
		RelatedProducts:   input.RelatedProducts,
		UsableMarijuana:   input.UsableMarijuana,
		BrandID:           input.BrandID,
		BrandName:         input.BrandName,
		Variants:          []*model.Variant{},
		ReviewRating:      input.ReviewRating,
		Reviews:           input.Reviews,
	}

	if input.Cbd != nil {
		product.Cbd = &model.Component{
			Amount:     input.Cbd.Amount,
			Percentage: input.Cbd.Percentage,
		}
	}

	if input.Cbda != nil {
		product.Cbda = &model.Component{
			Amount:     input.Cbda.Amount,
			Percentage: input.Cbda.Percentage,
		}
	}

	if input.Thc != nil {
		product.Thc = &model.Component{
			Amount:     input.Thc.Amount,
			Percentage: input.Thc.Percentage,
		}
	}

	if input.Thca != nil {
		product.Thca = &model.Component{
			Amount:     input.Thca.Amount,
			Percentage: input.Thca.Percentage,
		}
	}

	if input.CustomTax != nil {
		product.CustomTax = &model.TaxInfo{
			CityTax:    input.CustomTax.CityTax,
			FederalTax: input.CustomTax.FederalTax,
			StateTax:   input.CustomTax.StateTax,
		}
	}

	if input.Asset != nil {
		product.Asset = &model.Asset{
			Thumbnail:           input.Asset.Thumbnail,
			Image:               input.Asset.Image,
			ImageLargeSize:      input.Asset.ImageLargeSize,
			ImageMediumSize:     input.Asset.ImageMediumSize,
			ImageExtraLargeSize: input.Asset.ImageExtraLargeSize,
		}
	}

	for i := range input.Variants {
		product.Variants = append(product.Variants, &model.Variant{
			ID:    input.Variants[i].ID,
			Name:  input.Variants[i].Name,
			Price: input.Variants[i].Price,
			Type:  input.Variants[i].Type,
		})
	}

	return product
}

func (a *App) MapCategoryInput(input model.CategoryInput) model.Category {
	category := model.Category{
		ID:               input.ID,
		Name:             input.Name,
		Enabled:          input.Enabled,
		IsCannabis:       input.IsCannabis,
		CreatedAt:        input.CreatedAt,
		UpdatedAt:        input.UpdatedAt,
		Description:      input.Description,
		ShortDescription: input.ShortDescription,
		Priority:         input.Priority,
		UnitType:         input.UnitType,
		CannabisType:     input.CannabisType,
		WmCategory:       input.WmCategory,
		LowThreshold:     input.LowThreshold,
	}

	if input.Asset != nil {
		category.Asset = &model.Asset{
			Thumbnail:           input.Asset.Thumbnail,
			Image:               input.Asset.Image,
			ImageLargeSize:      input.Asset.ImageLargeSize,
			ImageMediumSize:     input.Asset.ImageMediumSize,
			ImageExtraLargeSize: input.Asset.ImageExtraLargeSize,
		}
	}

	return category
}

func (a *App) MapBlazeInput(input model.BlazeInput) model.Blaze {
	return model.Blaze{
		ID:            input.ID,
		Name:          input.Name,
		Handler:       input.Handler,
		Type:          input.Type,
		Category:      input.Category,
		CreatedAt:     input.CreatedAt,
		UpdatedAt:     input.UpdatedAt,
		Status:        input.Status,
		Sandbox:       input.Sandbox,
		AuthKey:       input.AuthKey,
		PartnerKey:    input.PartnerKey,
		DevAuthKey:    input.DevAuthKey,
		DevPartnerKey: input.DevPartnerKey,
	}
}

func (a *App) MapOnFleetInput(input model.OnFleetInput) model.OnFleet {
	return model.OnFleet{
		ID:             input.ID,
		Name:           input.Name,
		Handler:        input.Handler,
		Type:           input.Type,
		Category:       input.Category,
		CreatedAt:      input.CreatedAt,
		UpdatedAt:      input.UpdatedAt,
		Status:         input.Status,
		Sandbox:        input.Sandbox,
		User:           input.User,
		TestUser:       input.TestUser,
		AutoAssign:     input.AutoAssign,
		AutoAssignMode: input.AutoAssignMode,
	}
}

func (a *App) MapSystemApp(input model.SystemAppInput) model.System {
	return model.System{
		ID:        input.ID,
		Name:      input.Name,
		Handler:   input.Handler,
		Type:      input.Type,
		Category:  input.Category,
		CreatedAt: input.CreatedAt,
		UpdatedAt: input.UpdatedAt,
		Status:    input.Status,
	}
}

func (a *App) MapBerbixInput(input model.BerbixInput) model.Berbix {
	return model.Berbix{
		ID:        input.ID,
		Name:      input.Name,
		Handler:   input.Handler,
		Type:      input.Type,
		Category:  input.Category,
		CreatedAt: input.CreatedAt,
		UpdatedAt: input.UpdatedAt,
		Status:    input.Status,
		SecretKey: input.SecretKey,
		Template:  input.Template,
	}
}

func (a *App) MapJaneInput(input model.JaneInput) model.Jane {
	return model.Jane{
		ID:                    input.ID,
		Name:                  input.Name,
		Handler:               input.Handler,
		Type:                  input.Type,
		Category:              input.Category,
		CreatedAt:             input.CreatedAt,
		UpdatedAt:             input.UpdatedAt,
		Status:                input.Status,
		AppID:                 &input.AppID,
		APIKey:                &input.APIKey,
		StoreID:               &input.StoreID,
		ProductIndex:          &input.ProductIndex,
		ReviewsIndex:          &input.ReviewsIndex,
		ClientID:              &input.ClientID,
		ClientSecret:          &input.ClientSecret,
		Host:                  &input.Host,
		StoresIndex:           &input.StoresIndex,
		OperationClientID:     &input.OperationClientID,
		OperationClientSecret: &input.OperationClientSecret,
		AutoMigrateUser:       &input.AutoMigrateUser,
	}
}

func (a *App) MapTreezInput(input model.TreezInput) model.Treez {
	return model.Treez{
		ID:             input.ID,
		Name:           input.Name,
		Handler:        input.Handler,
		Type:           input.Type,
		Category:       input.Category,
		CreatedAt:      input.CreatedAt,
		UpdatedAt:      input.UpdatedAt,
		Status:         input.Status,
		ClientID:       input.ClientID,
		APIKey:         input.APIKey,
		DispensaryName: input.DispensaryName,
	}
}

func (a *App) MapDutchieInput(input model.DutchieInput) model.Dutchie {
	return model.Dutchie{
		ID:         input.ID,
		Name:       input.Name,
		Handler:    input.Handler,
		Type:       input.Type,
		Category:   input.Category,
		CreatedAt:  input.CreatedAt,
		UpdatedAt:  input.UpdatedAt,
		Status:     input.Status,
		APIKey:     input.APIKey,
		RetailerID: input.RetailerID,
	}
}

func (a *App) MapCovaInput(input model.CovaInput) model.Cova {
	return model.Cova{
		ID:           input.ID,
		Name:         input.Name,
		Handler:      input.Handler,
		Type:         input.Type,
		Category:     input.Category,
		CreatedAt:    input.CreatedAt,
		UpdatedAt:    input.UpdatedAt,
		Status:       input.Status,
		ClientID:     &input.ClientID,
		ClientSecret: &input.ClientSecret,
		Username:     &input.Username,
		Password:     &input.Password,
		CompanyID:    &input.CompanyID,
	}
}

func (a *App) MapBusinessAccount(input model.BusinessAccountInput) model.BusinessAccount {
	var address *model.BusinessAccountAddress

	if input.Address != nil {
		address = &model.BusinessAccountAddress{
			Address1:     input.Address.Address1,
			Address2:     input.Address.Address2,
			City:         input.Address.City,
			Zip:          input.Address.Zip,
			Province:     input.Address.Province,
			ProvinceCode: input.Address.ProvinceCode,
			Country:      input.Address.Country,
			CountryCode:  input.Address.CountryCode,
		}
	}

	return model.BusinessAccount{
		ID:        input.ID,
		Status:    input.Status,
		Company:   input.Company,
		FirstName: input.FirstName,
		LastName:  input.LastName,
		Phone:     input.Phone,
		Email:     input.Email,
		CreatedAt: input.CreatedAt,
		UpdatedAt: input.UpdatedAt,
		Signed:    input.Signed,
		Address:   address,
	}
}

func (a *App) MapRedirectInput(input model.RedirectInput) model.Redirect {
	links := make([]*string, 0, len(input.Links))

	for i := range input.Links {
		links = append(links, &input.Links[i])
	}

	return model.Redirect{
		ID:        input.ID,
		Name:      input.Name,
		Handler:   input.Handler,
		Type:      input.Type,
		Category:  input.Category,
		CreatedAt: input.CreatedAt,
		UpdatedAt: input.UpdatedAt,
		Status:    input.Status,
		Links:     links,
	}
}

func (a *App) MapJaneStoreWorkingHours(wh []jane.StoreWorkingHour) []*model.JaneStoreWorkingHour {
	workingHours := make([]*model.JaneStoreWorkingHour, 0, len(wh))

	for i := range wh {
		workingHours = append(workingHours, &model.JaneStoreWorkingHour{
			Day:  &wh[i].Day,
			From: &wh[i].Period.From,
			To:   &wh[i].Period.To,
		})
	}

	return workingHours
}

func (a *App) mapOrderPaymentDetals(pd *model.PaymentDetailInput) *model.PaymentDetail {
	if pd == nil {
		return nil
	}

	return &model.PaymentDetail{
		Type:     pd.Type,
		CardType: pd.CardType,
		LastFour: pd.LastFour,
		Refunded: pd.Refunded,
		RefundID: pd.RefundID,
	}
}

func (a *App) MapMinZipByCodeInput(input model.MinByZipCodeInput) model.MinZipByCode {
	locations := make([]*model.MinZipByCodeLocation, 0, len(input.Locations))

	for i := range input.Locations {
		locations = append(locations, &model.MinZipByCodeLocation{
			Name:   input.Locations[i].Name,
			Zips:   input.Locations[i].Zips,
			Amount: input.Locations[i].Amount,
		})
	}

	return model.MinZipByCode{
		ID:        input.ID,
		Name:      input.Name,
		Handler:   input.Handler,
		Type:      input.Type,
		Category:  input.Category,
		CreatedAt: input.CreatedAt,
		UpdatedAt: input.UpdatedAt,
		Status:    input.Status,
		Locations: locations,
	}
}

func (a *App) MapKlaviyoInput(input model.KlaviyoInput) model.Klaviyo {
	list := make([]*model.KlaviyoList, 0, len(input.Lists))

	for i := range input.Lists {
		list = append(list, &model.KlaviyoList{
			Name: input.Lists[i].Name,
			ID:   input.Lists[i].ID,
		})
	}

	return model.Klaviyo{
		ID:         input.ID,
		Name:       input.Name,
		Handler:    input.Handler,
		Type:       input.Type,
		Category:   input.Category,
		CreatedAt:  input.CreatedAt,
		UpdatedAt:  input.UpdatedAt,
		Status:     input.Status,
		Lists:      list,
		PrivateKey: input.PrivateKey,
	}
}

func (a *App) MapOmnisendInput(input model.OmnisendInput) model.Omnisend {
	return model.Omnisend{
		ID:        input.ID,
		Name:      input.Name,
		Handler:   input.Handler,
		Type:      input.Type,
		Category:  input.Category,
		CreatedAt: input.CreatedAt,
		UpdatedAt: input.UpdatedAt,
		Status:    input.Status,
		APIKey:    input.APIKey,
	}
}

func (a *App) mapJaneSpecialToSpecial(special jane.Special, storeID string) *model.JaneSpecial {
	id := fmt.Sprintf("%d", special.ID)

	discount := int(special.DiscountDollarAmount * 100)
	discountPercentage := int(special.DiscountPercent * 100)

	jSpecial := model.JaneSpecial{
		ID:                   &id,
		StoreID:              &storeID,
		Title:                &special.Title,
		Description:          &special.Description,
		Enabled:              &special.Enabled,
		EnabledFriday:        &special.EnabledFriday,
		EnabledMonday:        &special.EnabledMonday,
		EnabledSaturday:      &special.EnabledSaturday,
		EnabledSunday:        &special.EnabledSunday,
		EnabledThursday:      &special.EnabledThursday,
		EnabledTuesday:       &special.EnabledTuesday,
		EnabledWednesday:     &special.EnabledWednesday,
		DiscountDollarAmount: &discount,
		DiscountPercent:      &discountPercentage,
		PromoCode:            special.PromoCode,
		SpecialType:          (*string)(&special.SpecialType),
		StartDate:            special.StartDate,
		EndDate:              special.EndDate,
		BundleProducts:       []string{},
		Brands:               []string{},
		Kinds:                []*model.JaneSpecialKind{},
	}

	if special.Conditions.Bundle != nil {
		for i := range special.Conditions.Bundle.Independent.IncludedProductIds {
			jSpecial.BundleProducts = append(jSpecial.BundleProducts, fmt.Sprintf("%d", special.Conditions.Bundle.Independent.IncludedProductIds[i]))
		}

		jSpecial.Brands = special.Conditions.Bundle.Independent.Brands

		for i := range special.Conditions.Bundle.Independent.Kinds {
			jSpecial.Kinds = append(jSpecial.Kinds, &model.JaneSpecialKind{
				Kind:         &special.Conditions.Bundle.Independent.Kinds[i].Kind,
				BrandSubtype: special.Conditions.Bundle.Independent.Kinds[i].BrandSubtype,
				RootSubtype:  special.Conditions.Bundle.Independent.Kinds[i].RootSubtype,
			})
		}
	}

	return &jSpecial
}
