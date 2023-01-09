package gstattest

import (
	"context"
	"time"
)

type devNull struct{}

func NewDevNull() *devNull {
	return &devNull{}
}

func (d devNull) Increment(_ string) error                                  { return nil }
func (d devNull) IncrementContext(_ context.Context, _ string) error        { return nil }
func (d devNull) Timing(_ context.Context, _ string, _ time.Duration) error { return nil }
