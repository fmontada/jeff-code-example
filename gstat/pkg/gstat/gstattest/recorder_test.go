package gstattest_test

import (
	"context"

	"github.com/gap-commerce/gstat/pkg/gstat/gstattest"

	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func TestRecorder(t *testing.T) {
	const (
		counterStatName1 = "metric.total1"
		counterStatName2 = "metric.total2"
		durationStatName = "metric.duration"
	)

	t.Run("can increment", func(t *testing.T) {
		// Given
		recorder := gstattest.NewRecorder()

		// When
		recorder.Increment(counterStatName1)

		// Then
		assert.Equal(t, int64(1), recorder.GetCounter(counterStatName1))
		assert.Equal(t, int64(0), recorder.GetCounter(counterStatName2))
	})

	t.Run("can add timing", func(t *testing.T) {
		// Given
		recorder := gstattest.NewRecorder()

		// When
		recorder.Timing(context.Background(), durationStatName, time.Second)

		// Then
		assert.Equal(t, []time.Duration{time.Second}, recorder.GetTimings(durationStatName))
	})
}
