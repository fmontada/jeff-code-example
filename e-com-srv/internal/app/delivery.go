package app

import (
	"context"
	"errors"
	"math"

	"github.com/gap-commerce/srv-emberz/pkg/delivery/onfleet"
	"github.com/gap-commerce/srv-emberz/pkg/model"
	"github.com/go-resty/resty/v2"
)

func (a *App) GetDeliveryHubs(ctx context.Context, accountID string,
	storeID string) ([]*model.DeliveryHub, error) {
	appKey := a.GetResourceKey(
		accountID,
		storeID,
		a.Config.AppKey,
	)

	onFleetApp, err := a.Services.App.GetByHandler(ctx,
		appKey, "onfleet")
	if err != nil {
		a.Logger.Error(err)
		return nil, err
	}

	if onFleetApp == nil {
		return nil, errors.New("onfleet app is not configured")
	}

	fApp := (*onFleetApp).(model.OnFleet)

	user := *fApp.User

	if *fApp.Sandbox {
		user = *fApp.TestUser
	}

	rst := resty.New()

	onFleetSrv := onfleet.NewService(user, rst)

	hubs, err := onFleetSrv.ListHubs(ctx)
	if err != nil {
		a.Logger.Error(err)
		return nil, err
	}

	return a.MapOnFleetHubsToHub(hubs), err
}

func (a *App) ListWorkersInLocation(ctx context.Context, accountID string,
	storeID string, location []*float64,
	radius *float64) ([]*model.DeliveryWorker, error) {
	if len(location) != 2 {
		return nil, errors.New("wrong location format, it must be longitude and latitude")
	}

	appKey := a.GetResourceKey(
		accountID,
		storeID,
		a.Config.AppKey,
	)

	onFleetApp, err := a.Services.App.GetByHandler(ctx,
		appKey, "onfleet")
	if err != nil {
		a.Logger.Error(err)
		return nil, err
	}

	if onFleetApp == nil {
		return nil, errors.New("onfleet app is not configured")
	}

	fApp := (*onFleetApp).(model.OnFleet)

	user := *fApp.User

	if *fApp.Sandbox {
		user = *fApp.TestUser
	}

	rst := resty.New()

	onFleetSrv := onfleet.NewService(user, rst)

	wrks, err := onFleetSrv.GetWorkersByLocation(ctx, *location[0], *location[1], radius)
	if err != nil {
		return nil, err
	}

	return a.MapOnFleetWorkersToWorker(wrks), err
}

func (a *App) GetDeliveryEta(ctx context.Context,
	accountID string, storeID string, location []*float64,
	notIncludedVehicles []*model.DeliveryVehicleType) ([]*model.DeliveryEta, error) {
	if len(location) != 2 {
		return nil, errors.New("wrong location format, it must be longitude and latitude")
	}

	appKey := a.GetResourceKey(
		accountID,
		storeID,
		a.Config.AppKey,
	)

	onFleetApp, err := a.Services.App.GetByHandler(ctx,
		appKey, "onfleet")
	if err != nil {
		a.Logger.Error(err)
		return nil, err
	}

	if onFleetApp == nil {
		return nil, errors.New("onfleet app is not configured")
	}

	fApp := (*onFleetApp).(model.OnFleet)

	user := *fApp.User

	if *fApp.Sandbox {
		user = *fApp.TestUser
	}

	rst := resty.New()

	onFleetSrv := onfleet.NewService(user, rst)

	teams, err := onFleetSrv.ListTeams(ctx)
	if err != nil {
		a.Logger.Error(err)
		return nil, err
	}

	lct := make([]float64, 0, len(location))

	for l := range location {
		lct = append(lct, *(location[l]))
	}

	rstVehicles := make([]onfleet.VehicleType, 0, len(notIncludedVehicles))

	for v := range notIncludedVehicles {
		vhc := *(notIncludedVehicles[v])
		rstVehicles = append(rstVehicles, onfleet.VehicleType(vhc))
	}

	driversETA := make([]*model.DeliveryEta, 0)

	for _, t := range teams {
		if t.Hub == nil {
			continue
		}

		est, err := onFleetSrv.GetDriverTimeEstimates(ctx,
			t.ID, lct, nil,
			nil, nil, rstVehicles)
		if err != nil {
			continue
		}

		worker, err := onFleetSrv.GetWorker(ctx, est.WorkerID, nil)
		if err != nil {
			a.Logger.Error(err)
			return nil, err
		}

		drv := a.MapOnFleetDriverETAToDriverETA(worker.Name, worker.ImageUrl, *est)
		driversETA = append(driversETA, drv)
	}

	return driversETA, err
}

func (a *App) GetDistance(ctx context.Context, from model.Coordinates, to model.Coordinates) ([]*model.Distance, error) {
	fromLatitude := a.degreesToRadians(from.Latitude)
	fromLongitude := a.degreesToRadians(from.Longitude)
	toLatitude := a.degreesToRadians(to.Latitude)
	toLongitude := a.degreesToRadians(to.Longitude)

	latitudeDifference := toLatitude - fromLatitude
	longitudeDifference := toLongitude - fromLongitude

	v := math.Pow(math.Sin(latitudeDifference/2), 2) + math.Cos(fromLatitude)*math.Cos(toLatitude)*
		math.Pow(math.Sin(longitudeDifference/2), 2)

	c := 2 * math.Atan2(math.Sqrt(v), math.Sqrt(1-v))

	distanceKM := math.Round(c*earthRadiusKilometer*100) / 100
	distanceMI := math.Round(c*earthRadiusMiles*100) / 100

	if ctx.Err() != nil {
		return nil, ctx.Err()
	}

	return []*model.Distance{
		{
			Dimension: model.DistanceDimensionUnitTypeKm,
			Value:     distanceKM,
		},
		{
			Dimension: model.DistanceDimensionUnitTypeMi,
			Value:     distanceMI,
		},
	}, nil

}

func (a *App) degreesToRadians(d float64) float64 {
	return d * math.Pi / 180
}
