package gstattest

import (
	"context"
	"time"
)

type recorder struct {
	counters map[string]int64
	timings  map[string][]time.Duration
}

func NewRecorder() *recorder {
	return &recorder{
		counters: make(map[string]int64),
		timings:  make(map[string][]time.Duration),
	}
}

func (r *recorder) Increment(name string) {
	r.counters[name]++
}

func (r *recorder) IncrementContext(ctx context.Context, name string) {
	r.Increment(name)
}

func (r *recorder) Timing(ctx context.Context, name string, duration time.Duration) {
	r.timings[name] = append(r.timings[name], duration)
}

func (r *recorder) GetCounter(name string) int64 {
	return r.counters[name]
}

func (r *recorder) GetTimings(name string) []time.Duration {
	return r.timings[name]
}
