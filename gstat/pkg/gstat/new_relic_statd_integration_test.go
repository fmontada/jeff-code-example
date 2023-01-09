// +build integration

package gstat_test

import (
	"context"
	"github.com/gap-commerce/glog/test"
	"github.com/gap-commerce/gstat/pkg/gstat"
	"os"
	"testing"
	"time"

	"github.com/newrelic/go-agent/v3/newrelic"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestIntegrationWithNewRelicInsightsInsert(t *testing.T) {
	t.Parallel()

	const (
		requiredEnvVarSkipPrefix = "the "
		requiredEnvVarSkipSuffix = " environment variable must be set for this test to execute"

		newRelicInsightsInsertKeyEnvVarName = "NR_INSIGHTS_INSERT_KEY"
		gcEnvironmentEnvVarName             = "ENV"

		serviceName = "gstat_integration_test"
	)

	key, ok := os.LookupEnv(newRelicInsightsInsertKeyEnvVarName)
	if !ok {
		t.Skip(requiredEnvVarSkipPrefix, newRelicInsightsInsertKeyEnvVarName, requiredEnvVarSkipSuffix)
	}

	env, ok := os.LookupEnv(gcEnvironmentEnvVarName)
	if !ok {
		t.Skip(requiredEnvVarSkipPrefix, gcEnvironmentEnvVarName, requiredEnvVarSkipSuffix)
	}

	recorder := test.NewLogRecorder()

	type contextFn func(*testing.T, string) context.Context

	noNewRelicAPMContext := func(*testing.T, string) context.Context {
		return context.Background()
	}

	testcases := []struct {
		name  string
		ctxFn contextFn
	}{
		{"With New Relic transaction in context", buildNewRelicAPMContext},
		{"Without New Relic transaction in context", noNewRelicAPMContext},
	}

	for _, testcase := range testcases {
		testcase := testcase // descope variable

		t.Run(testcase.name, func(t *testing.T) {
			t.Parallel()

			relicStatsD, err := gstat.NewRelicStatsD(
				key,
				recorder,
				map[string]interface{}{gstat.ServiceNameKey: serviceName, gstat.ServiceEnvKey: env},
			)
			require.NoError(t, err)
			assert.NotNil(t, relicStatsD)

			ctx := testcase.ctxFn(t, serviceName)

			timer := func(name string, duration time.Duration) {
				start := time.Now()
				time.Sleep(duration)
				relicStatsD.Timing(ctx, name, time.Since(start))
			}

			func() {
				defer newrelic.FromContext(ctx).StartSegment("gstat fake web request").End()

				start := time.Now()
				time.Sleep(500 * time.Microsecond)
				timer("process request", 2*time.Millisecond)
				timer("call database", 6*time.Millisecond)
				timer("process result set", 4*time.Millisecond)
				timer("prepare response", 2*time.Millisecond)
				time.Sleep(500 * time.Microsecond)
				relicStatsD.Timing(ctx, "gstat fake web request", time.Since(start))
			}()
			assert.Empty(t, recorder.Errors)

			relicStatsD.IncrementContext(ctx, "gstat fake web request")
			relicStatsD.IncrementContext(ctx, "gstat fake web request")
			relicStatsD.IncrementContext(ctx, "gstat fake web request")
			assert.Empty(t, recorder.Errors)

			newrelic.FromContext(ctx).End()
			relicStatsD.Flush()
		})
	}
}
