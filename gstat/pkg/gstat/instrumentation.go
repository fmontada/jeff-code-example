package gstat

import (
	"context"
	"time"
)

// Instrumentation defines methods required for a light-weight abstraction
// of a statsd-like metric collector.
type Instrumentation interface {
	// Deprecated: use IncrementContext instead.  For the equivalent
	// behavior, use context.Background() as the value of ctx.
	Increment(name string) error

	// IncrementContext increases the value of a Gauge associated with the
	// provided name.  It accepts a context which might contain a trace
	// identifier to which this Gauge can be associated.
	IncrementContext(ctx context.Context, name string) error

	// Timing records a duration associated with the provided name.  If
	// the incoming context includes a trace identifier, this duration
	// will be considered a span within that trace.
	Timing(ctx context.Context, name string, duration time.Duration) error
}
