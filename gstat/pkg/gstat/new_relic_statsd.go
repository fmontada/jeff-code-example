package gstat

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"github.com/gap-commerce/glog/pkg/glog"
	"time"

	"github.com/newrelic/go-agent/v3/newrelic"
	"github.com/newrelic/newrelic-telemetry-sdk-go/telemetry"
)

const (
	TraceIDLength                      = 16
	SpanIDLength                       = 8
	RecordSpanError                    = "failed to record a span with ID"
	RandomIDFailed                     = "failed to generate a random span ID"
	NoServiceName           GstatError = "failed to retrieve the service name"
	HarvesterCreationFailed            = "failed to create a New Relic harvester"
)

// Counter defines a method that increments a monotonic, unsigned integer.
type Counter interface {
	Increment()
}

type Harvester interface {
	Flush()
	NewCounter(name string, labels map[string]interface{}) Counter
	RecordSpan(telemetry.Span) error
}

type relicHarvester struct {
	harvester *telemetry.Harvester
}

func (h relicHarvester) Flush() {
	h.harvester.HarvestNow(context.Background())
}

func (h relicHarvester) NewCounter(name string, labels map[string]interface{}) Counter {
	return h.harvester.MetricAggregator().Count(name, labels)
}

func (h relicHarvester) RecordSpan(span telemetry.Span) error {
	return h.harvester.RecordSpan(span)
}

// RelicStatsD provides a statsd-like facade for the New Relic APM
// library's (go-agent) "app".
type RelicStatsD struct {
	serviceName string
	logger      glog.Logger
	labels      map[string]interface{}
	harvester   Harvester
	counters    map[string]Counter
	idFn        func(n int) (string, error)
	nowFn       func() time.Time
}

// NewRelicStatsD creates an Instrumentation that sends count and timing
// data to New Relic using a New Relic Insights Insert key. These keys
// can be created at https://insights.newrelic.com/accounts/2858027/manage/api_keys.
func NewRelicStatsD(insertKey string, logger glog.Logger, labels map[string]interface{}) (*RelicStatsD, error) {
	harvester, err := telemetry.NewHarvester(
		telemetry.ConfigAPIKey(insertKey),
		telemetry.ConfigCommonAttributes(labels),
	)
	if err != nil {
		return nil, fmt.Errorf("%s - %w", HarvesterCreationFailed, err)
	}

	serviceName, ok := (labels[ServiceNameKey]).(string)
	if !ok {
		return nil, NoServiceName
	}

	relic := &RelicStatsD{
		serviceName: serviceName,
		logger:      logger,
		labels:      labels,
		harvester:   relicHarvester{harvester: harvester},
		counters:    map[string]Counter{},
		nowFn:       time.Now,
		idFn:        nil,
	}
	relic.idFn = relic.RandomID

	return relic, nil
}

// Flush causes the harvester to immediately upload cached telemetry and
// clears intermediate data for certain types of telemetry.
func (i RelicStatsD) Flush() {
	i.harvester.Flush()
}

// Deprecated: Increment.  Use IncrementContext() instead.
// For the equivalent behavior, use context.Background() as the value
// of ctx.
func (i RelicStatsD) Increment(name string) error {
	i.IncrementContext(context.Background(), name)
	return nil
}

// IncrementContext increases the value of a Gauge associated with the
// provided name.  It accepts a context which might contain a trace
// identifier to which this Gauge can be associated.
func (i RelicStatsD) IncrementContext(ctx context.Context, name string) error {
	i.getCounter(name).Increment()
	return nil
}

// Timing records a duration associated with the provided name.  If
// the incoming context includes a span identifier, this duration
// will be considered a span within that trace.
func (i RelicStatsD) Timing(ctx context.Context, name string, duration time.Duration) error {
	start := i.nowFn().Add(-duration)

	ID, err := i.idFn(SpanIDLength)
	if err != nil {
		i.logger.Errorf("%s - %w", RandomIDFailed, err)

		return err
	}

	txn := newrelic.FromContext(ctx)
	linkingMetadata := txn.GetLinkingMetadata()

	serviceName := linkingMetadata.EntityName
	if serviceName == "" {
		serviceName = i.serviceName
	}

	traceID := linkingMetadata.TraceID
	if traceID == "" {
		traceID, err = i.idFn(TraceIDLength)
		if err != nil {
			i.logger.Error(err)
		}
	}

	err = i.harvester.RecordSpan(telemetry.Span{
		ID:          ID,
		TraceID:     traceID,
		Name:        name,
		Timestamp:   start,
		Duration:    duration,
		ServiceName: serviceName,
		ParentID:    linkingMetadata.SpanID,
	})
	if err != nil {
		i.logger.Errorf("%s %s - %w", RecordSpanError, ID, err)
		return err
	}

	return nil
}

// RandomID returns a hex string representing n random bytes.
func (i RelicStatsD) RandomID(n int) (string, error) {
	bytes := make([]byte, n)
	if _, err := rand.Read(bytes); err != nil {
		return "", fmt.Errorf("%s - %w", RandomIDFailed, err)
	}

	return hex.EncodeToString(bytes), nil
}

// SetHarvester allows an alternate harvester to be used during testing.
// The default harvester is the New Relic Harvester from
// https://pkg.go.dev/github.com/newrelic/newrelic-telemetry-sdk-go/telemetry#Harvester.
func (i *RelicStatsD) SetHarvester(harvester Harvester) {
	i.harvester = harvester
}

// SetIDFn allows an alternate ID generator to be used during testing.
// The default ID generator is RandomID().
func (i *RelicStatsD) SetIDFn(idFn func(n int) (string, error)) {
	i.idFn = idFn
}

// SetNowFn allows an alternate clock to be used during testing.  The
// default value of the now function is time.Now().
func (i *RelicStatsD) SetNowFn(nowFn func() time.Time) {
	i.nowFn = nowFn
}

func (i RelicStatsD) getCounter(name string) Counter {
	c, ok := i.counters[name]
	if !ok {
		c = i.harvester.NewCounter(name, map[string]interface{}{})
		i.counters[name] = c
	}

	return c
}
