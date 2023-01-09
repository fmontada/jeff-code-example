package gstat

import (
	"context"
	"errors"
	"github.com/aws/aws-sdk-go-v2/service/cloudwatch"
	"github.com/stretchr/testify/require"
	"testing"
	"time"
)

const (
	awsNameSpace = "gc-testing"
)

func TestAwsMetricsTiming(t *testing.T) {
	t.Run("successfully metric timing service", func(t *testing.T) {
		// Given
		awsCloudwatch := MockAWSCloudwatch{}

		stats := NewAwsMetrics(&awsCloudwatch, awsNameSpace)

		t1 := time.Now()
		t2 := time.Now().Add(20 * time.Minute)
		diff := t2.Sub(t1)

		// When
		ctx := context.Background()
		err := stats.Timing(ctx, "gstattiming", diff)

		// Then
		require.NoError(t, err)
	})

	t.Run("failed metric timing service", func(t *testing.T) {
		// Given
		awsCloudwatch := MockAWSFailedCloudwatch{}

		stats := NewAwsMetrics(&awsCloudwatch, awsNameSpace)

		t1 := time.Now()
		t2 := time.Now().Add(2 * time.Minute)
		diff := t2.Sub(t1)

		// When
		ctx := context.Background()
		err := stats.Timing(ctx, "gstattiming", diff)

		// Then
		require.NotNil(t, err)
	})
}

func TestAwsMetricsIncrement(t *testing.T) {
	t.Run("successfully metric increment service", func(t *testing.T) {
		// Given
		awsCloudwatch := MockAWSCloudwatch{}

		stats := NewAwsMetrics(&awsCloudwatch, awsNameSpace)

		// When
		ctx := context.Background()
		err := stats.IncrementContext(ctx, "gstatcount")

		// Then
		require.NoError(t, err)
	})

	t.Run("failed metric increment service", func(t *testing.T) {
		// Given
		awsCloudwatch := MockAWSFailedCloudwatch{}

		stats := NewAwsMetrics(&awsCloudwatch, awsNameSpace)

		// When
		ctx := context.Background()
		err := stats.IncrementContext(ctx, "gstatcount")

		// Then
		require.NotNil(t, err)
	})
}

type MockAWSCloudwatch struct {
}

func (m *MockAWSCloudwatch) PutMetricData(ctx context.Context, params *cloudwatch.PutMetricDataInput, optFns ...func(*cloudwatch.Options)) (*cloudwatch.PutMetricDataOutput, error) {
	return nil, nil
}

type MockAWSFailedCloudwatch struct {
}

func (m *MockAWSFailedCloudwatch) PutMetricData(ctx context.Context, params *cloudwatch.PutMetricDataInput, optFns ...func(*cloudwatch.Options)) (*cloudwatch.PutMetricDataOutput, error) {
	return nil, errors.New("cannot put metric data")
}
