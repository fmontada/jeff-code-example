package gstat_test

import (
	"context"
	"encoding/hex"

	"github.com/gap-commerce/glog/test"

	"github.com/gap-commerce/glog/pkg/glog"

	"github.com/gap-commerce/gstat/pkg/gstat"
	"testing"
	"time"

	"github.com/newrelic/go-agent/v3/newrelic"
	"github.com/newrelic/newrelic-telemetry-sdk-go/telemetry"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

const (
	serviceName = "gstat_test"

	idGenerationError gstat.GstatError = "could not generate random hex digits"
)

func TestNewRelicStatsD_Errors(t *testing.T) {
	t.Parallel()

	testcases := []struct {
		name           string
		insertKey      string
		expectedErrMsg string
	}{
		{"With empty insert key", "", "APIKey is required"},
		{"Without service.name label", "fake insert key", "failed to retrieve the service name"},
	}

	for _, testcase := range testcases {
		testcase := testcase // descope variable

		t.Run(testcase.name, func(t *testing.T) {
			t.Parallel()

			// When
			_, err := gstat.NewRelicStatsD(testcase.insertKey, nil, map[string]interface{}{})

			// Then
			require.Error(t, err)
			assert.Contains(t, err.Error(), testcase.expectedErrMsg)
		})
	}
}

func TestIncrementing(t *testing.T) {
	t.Parallel()

	const counterName = "test_counter"

	// Given
	relicStatsD, harvester := getRelicStatsDWithMockHarvester(t, nil)

	// When
	for i := 0; i < 5; i++ {
		relicStatsD.Increment(counterName)
	}

	// Then
	count, ok := harvester.counters[counterName]
	require.True(t, ok)
	mock, ok := count.(mockCount)
	require.True(t, ok)
	assert.Equal(t, uint64(5), mock.Value())
}

func TestTiming(t *testing.T) {
	t.Parallel()

	// Given
	spanStart := parseRFC3339(t, "2020-12-31T23:59:59.958Z")
	spanEnd := parseRFC3339(t, "2021-01-01T00:00:00Z")

	relicStatsD, harvester := getRelicStatsDWithMockHarvester(t, nil)
	relicStatsD.SetNowFn(func() time.Time {
		return spanEnd
	})

	const (
		timerName     = "test_timer"
		timerDuration = 42 * time.Millisecond
	)

	assertSpan := func(t *testing.T, span *telemetry.Span) {
		t.Helper()

		assertHexBytes(t, span.ID, gstat.SpanIDLength)
		assert.Equal(t, spanStart, span.Timestamp)
		assert.Equal(t, "", span.ParentID)
		assert.Equal(t, timerDuration, span.Duration)
		assert.Equal(t, serviceName, span.ServiceName)
		assert.Equal(t, map[string]interface{}(nil), span.Attributes)
		assert.Equal(t, []telemetry.Event(nil), span.Events)
	}

	t.Run("Without linking metadata", func(t *testing.T) {
		t.Parallel()

		const timerName = "unlinked_test_timer"

		// When
		relicStatsD.Timing(context.Background(), timerName, timerDuration)

		// Then
		span := harvester.spans[timerName]
		assertSpan(t, span)
		assert.Len(t, span.TraceID, gstat.TraceIDLength*2)
	})

	t.Run("With linking metadata", func(t *testing.T) {
		t.Parallel()

		const timerName = "linked_test_timer"

		// When
		relicStatsD.Timing(buildNewRelicAPMContext(t, serviceName), timerName, timerDuration)

		// Then
		span := harvester.spans[timerName]
		assertSpan(t, span)
		assertHexBytes(t, span.TraceID, 16)
	})

	t.Run("With id generation error", func(t *testing.T) {
		t.Parallel()

		// Given
		recorder := test.NewLogRecorder()
		relicStatsD, _ := getRelicStatsDWithMockHarvester(t, recorder)
		relicStatsD.SetIDFn(erroringID)

		// When
		relicStatsD.Timing(context.Background(), "id error", 21*time.Millisecond)

		// Then
		assert.Contains(t, recorder.Errors[0], idGenerationError)
	})

	t.Run("With record span error", func(t *testing.T) {
		t.Parallel()

		// Given
		recorder := test.NewLogRecorder()
		relicStatsD, _ := getRelicStatsDWithMockHarvester(t, recorder)
		relicStatsD.SetHarvester(erroringHarvester{})

		// When
		relicStatsD.Timing(context.Background(), "record span error", 84*time.Millisecond)

		// Then
		assert.Contains(t, recorder.Errors[0], DoNotErroringHarvesterInProduction)
	})
}

type RelicTestError string

func (e RelicTestError) Error() string {
	return string(e)
}

const (
	DoNotErroringHarvesterInProduction RelicTestError = "do not use erroring harvester in production"
)

type mockCount struct {
	value *uint64
}

func (c mockCount) Increment() {
	*c.value++
}

func (c mockCount) Value() uint64 {
	return *c.value
}

type mockHarvester struct {
	counters map[string]gstat.Counter
	spans    map[string]*telemetry.Span
}

func (h mockHarvester) Flush() {}

func (h mockHarvester) NewCounter(name string, labels map[string]interface{}) gstat.Counter {
	var v uint64

	counter := mockCount{
		value: &v,
	}
	h.counters[name] = counter

	return counter
}

func (h mockHarvester) RecordSpan(span telemetry.Span) error {
	h.spans[span.Name] = &span

	return nil
}

type erroringHarvester struct{}

func (h erroringHarvester) Flush() {}

func (h erroringHarvester) NewCounter(name string, labels map[string]interface{}) gstat.Counter {
	return nil
}

func (h erroringHarvester) RecordSpan(span telemetry.Span) error {
	return DoNotErroringHarvesterInProduction
}

func erroringID(n int) (string, error) {
	return "", idGenerationError
}

func assertHexBytes(t *testing.T, id string, length int) {
	t.Helper()

	bytes, err := hex.DecodeString(id)
	assert.NoError(t, err)
	assert.Len(t, bytes, length)
}

func buildNewRelicAPMContext(t *testing.T, serviceName string) context.Context {
	t.Helper()

	// the fake license key must be 40 characters long - since the app
	// is configured to be disabled and it doesn't have a valid license
	// it will add trace IDs to the returned context but not span IDs.
	const fakeLicenseKey = "fake ingest license key - 78901234567890"

	app, err := newrelic.NewApplication(
		newrelic.ConfigAppName(serviceName),
		newrelic.ConfigLicense(fakeLicenseKey),
		newrelic.ConfigDistributedTracerEnabled(true),
		newrelic.ConfigEnabled(false),
	)
	require.NoError(t, err)

	return newrelic.NewContext(context.Background(), app.StartTransaction("gstat_transaction"))
}

func getRelicStatsDWithMockHarvester(t *testing.T, logger glog.Logger) (*gstat.RelicStatsD, mockHarvester) {
	t.Helper()

	relicStatsD, err := gstat.NewRelicStatsD(
		"fake_new_relic_insights_insert_key",
		logger,
		map[string]interface{}{gstat.ServiceNameKey: serviceName},
	)
	require.NoError(t, err)
	require.NotNil(t, relicStatsD)

	harvester := mockHarvester{
		counters: map[string]gstat.Counter{},
		spans:    map[string]*telemetry.Span{},
	}

	relicStatsD.SetHarvester(harvester)

	return relicStatsD, harvester
}

func parseRFC3339(t *testing.T, rfc3339 string) time.Time {
	t.Helper()

	time, err := time.Parse(time.RFC3339, rfc3339)
	require.NoError(t, err)

	return time
}
