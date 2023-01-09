package gstat

import (
	"time"
)

type devNull struct{}

func NewDevNull() *devNull {
	return &devNull{}
}

func (d devNull) Increment(_ string)               {}
func (d devNull) Decrement(_ string)               {}
func (d devNull) Timing(_ string, _ time.Duration) {}
