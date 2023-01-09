package app

import (
	"context"
	"testing"

	"github.com/gap-commerce/srv-emberz/pkg/model"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// coordinates and distance obtained from https://www.igismap.com/haversine-formula-calculate-geographic-distance-earth/
func TestDistanceMethod(t *testing.T) {
	t.Run("successfully get distance", func(t *testing.T) {
		// Given
		app := NewApp(Service{}, AppConfig{}, nil)

		// When
		distance, err := app.GetDistance(context.Background(), model.Coordinates{
			Longitude: -99.436554,
			Latitude:  41.507483,
		}, model.Coordinates{
			Longitude: -98.315949,
			Latitude:  38.504048,
		})

		// Then
		require.NoError(t, err)
		require.NotNil(t, distance)
		require.Greater(t, len(distance), 0)

		assert.Equal(t, 347.33, distance[0].Value)
	})

	t.Run("failed to get distance, context is cancelled", func(t *testing.T) {
		// Given
		app := NewApp(Service{}, AppConfig{}, nil)

		ctx, cancel := context.WithCancel(context.Background())

		cancel()

		// When
		distance, err := app.GetDistance(ctx, model.Coordinates{
			Longitude: -99.436554,
			Latitude:  41.507483,
		}, model.Coordinates{
			Longitude: -98.315949,
			Latitude:  38.504048,
		})

		// Then
		require.Error(t, err)
		require.Nil(t, distance)
	})
}
