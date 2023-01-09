package gstat

import (
	"context"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/cloudwatch"
	"github.com/aws/aws-sdk-go-v2/service/cloudwatch/types"
	pkgAws "github.com/gap-commerce/srv-emberz/pkg/aws"
)

type awsMetrics struct {
	client    pkgAws.Cloudwatch
	namespace string
}

func NewAwsMetrics(cloudwatch pkgAws.Cloudwatch, namespace string) *awsMetrics {
	return &awsMetrics{
		client:    cloudwatch,
		namespace: namespace,
	}
}

func (m *awsMetrics) Increment(name string) error {
	return m.IncrementContext(context.Background(), name)
}

func (m *awsMetrics) IncrementContext(ctx context.Context, name string) error {
	t := time.Now()

	params := &cloudwatch.PutMetricDataInput{
		MetricData: []types.MetricDatum{{
			MetricName: aws.String(name),
			Timestamp:  &t,
			Value:      aws.Float64(1),
			Dimensions: []types.Dimension{
				{
					Name:  aws.String("counter"),
					Value: aws.String("counter"),
				},
			},
			Unit: types.StandardUnitNone,
		}},
		Namespace: aws.String(m.namespace),
	}

	_, err := m.client.PutMetricData(ctx, params)
	return err
}

func (m *awsMetrics) Timing(ctx context.Context, name string, duration time.Duration) error {
	t := time.Now()
	v := float64(duration.Milliseconds())

	params := &cloudwatch.PutMetricDataInput{
		MetricData: []types.MetricDatum{{
			MetricName: aws.String(name),
			Timestamp:  &t,
			Unit:       types.StandardUnitMilliseconds,
			Value:      aws.Float64(v),
		}},
		Namespace: aws.String(m.namespace),
	}

	_, err := m.client.PutMetricData(ctx, params)
	return err
}
