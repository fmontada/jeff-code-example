package resolver

import (
	"context"
	"github.com/gap-commerce/srv-ecommerce/internal/app"
	"github.com/gap-commerce/srv-emberz/pkg/model"
)

func (r *queryResolver) ListVendors(ctx context.Context,
	accountID string, storeID string) ([]*model.Vendor, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)

	key := r.app.GetResourceKey(
		accountID,
		storeID,
		r.app.Config.VendorKey,
	)

	d, err := r.app.Services.Vendor.GetAll(ct, key)
	if err != nil {
		return nil, err
	}

	return r.app.MapVendorList(d), nil
}

func (r *queryResolver) GetVendor(ctx context.Context,
	accountID string, storeID string, vendorID string) (*model.Vendor, error) {
	ct, _ := context.WithTimeout(ctx, app.CtxTimeout)

	key := r.app.GetResourceKey(
		accountID,
		storeID,
		r.app.Config.VendorKey,
	)

	return r.app.Services.Vendor.Get(ct, vendorID, key)
}
