package gstat_test

import (
	"github.com/gap-commerce/glog/test"
	"github.com/gap-commerce/gstat/pkg/gstat"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestClient(t *testing.T) {
	t.Run("constructs with no options", func(t *testing.T) {
		// Given
		const serviceName = "service_name"

		// When
		client, err := gstat.NewClient(serviceName)

		// Then
		require.NoError(t, err)
		assert.NotNil(t, client)
	})

	t.Run("constructs with datadog with no error", func(t *testing.T) {
		// Given
		const serviceName = "service_name"
		const metric = "some.metric"
		logger := test.NewLogRecorder()
		client, err := gstat.NewClient(serviceName,
			gstat.WithDatadog("127.0.0.1", "8125"),
			gstat.WithLogger(logger),
		)
		require.NoError(t, err)

		// When
		client.Increment(metric)

		// Then
		assert.NotNil(t, client)
		assert.Equal(t, []string(nil), logger.Errors)
	})

	t.Run("constructs with NewRelic with no error", func(t *testing.T) {
		// Given
		const serviceName = "service_name"
		const metric = "some.metric"
		logger := test.NewLogRecorder()
		client, err := gstat.NewClient(serviceName,
			gstat.WithNewRelic("not a real insert key"),
			gstat.WithLogger(logger),
			gstat.WithBuild("deadbeef", "2021-02-02"),
			gstat.WithEnv("local"),
		)
		require.NoError(t, err)

		// When
		client.Increment(metric)

		// Then
		assert.NotNil(t, client)
		assert.Empty(t, logger.Errors)
	})

	t.Run("constructs with build", func(t *testing.T) {
		// Given
		const serviceName = "service_name"

		// When
		client, err := gstat.NewClient(serviceName,
			gstat.WithBuild("version", "2020-10-06"),
		)

		// Then
		require.NoError(t, err)
		assert.NotNil(t, client)
	})

	t.Run("fails from missing version", func(t *testing.T) {
		// Given
		const serviceName = "service_name"

		// When
		client, err := gstat.NewClient(serviceName,
			gstat.WithBuild("", "2020-10-06"),
		)

		// Then
		assert.EqualError(t, err, "must provides values for version and buildDate")
		assert.Nil(t, client)
	})

	t.Run("fails from missing buildDate", func(t *testing.T) {
		// Given
		const serviceName = "service_name"

		// When
		client, err := gstat.NewClient(serviceName,
			gstat.WithBuild("v1.2.3", ""),
		)

		// Then
		assert.EqualError(t, err, "must provides values for version and buildDate")
		assert.Nil(t, client)
	})
}
