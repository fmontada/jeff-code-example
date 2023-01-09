package gstat

import (
	"context"
	"fmt"
	"github.com/gap-commerce/glog/pkg/glog"
	"time"

	"github.com/DataDog/datadog-go/statsd"
)

type dogStatsD struct {
	client       *statsd.Client
	metricPrefix string
	tags         []string
	logger       glog.Logger
}

// NewDogStatsD constructs a DataDog StatsD client.
// https://docs.datadoghq.com/developers/dogstatsd
func NewDogStatsD(addr string, prefix string, logger glog.Logger, tags ...string) (*dogStatsD, error) {
	client, err := statsd.New(addr)
	if err != nil {
		return nil, err
	}

	return &dogStatsD{
		client:       client,
		metricPrefix: prefix,
		tags:         tags,
		logger:       logger,
	}, nil
}

func (d *dogStatsD) Increment(name string) error {
	d.IncrementContext(context.Background(), name)
	return nil
}

func (d *dogStatsD) IncrementContext(ctx context.Context, name string) error {
	err := d.client.Incr(d.metricName(name), d.tags, 1)
	d.logIfError(err)
	return err
}

func (d *dogStatsD) Timing(ctx context.Context, name string, duration time.Duration) error {
	err := d.client.Timing(d.metricName(name), duration, d.tags, 1)
	d.logIfError(err)
	return err
}

func (d *dogStatsD) logIfError(err error) {
	if err != nil {
		d.logger.Error(err)
	}
}

func (d *dogStatsD) metricName(name string) string {
	if d.metricPrefix != "" {
		return fmt.Sprintf("%s.%s", d.metricPrefix, name)
	}

	return name
}
