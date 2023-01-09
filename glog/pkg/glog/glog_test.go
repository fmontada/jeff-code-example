package glog

import (
	"bytes"
	"github.com/stretchr/testify/require"
	"testing"
)

func TestConfig(t *testing.T) {
	t.Run("test config levels", func(t *testing.T) {
		t.Run("test trace config", func(t *testing.T) {
			logger := New(Config{
				AppName: "TestConfig",
				Level:   "Trace",
			})

			require.True(t, logger.IsDebugEnabled())
			require.Equal(t, "trace", logger.GetLogLevel())
		})

		t.Run("test debug config", func(t *testing.T) {
			logger := New(Config{
				AppName: "TestConfig",
				Level:   "Debug",
			})

			require.True(t, logger.IsDebugEnabled())
			require.Equal(t, "debug", logger.GetLogLevel())
		})

		t.Run("test info config", func(t *testing.T) {
			logger := New(Config{
				AppName: "TestConfig",
				Level:   "Info",
			})

			require.False(t, logger.IsDebugEnabled())
			require.Equal(t, "info", logger.GetLogLevel())
		})

		t.Run("test warn config (all caps)", func(t *testing.T) {
			logger := New(Config{
				AppName: "TestConfig",
				Level:   "WARN",
			})

			require.False(t, logger.IsDebugEnabled())
			require.Equal(t, "warning", logger.GetLogLevel())
		})

		t.Run("test error config (all lower)", func(t *testing.T) {
			logger := New(Config{
				AppName: "TestConfig",
				Level:   "error",
			})

			require.False(t, logger.IsDebugEnabled())
			require.Equal(t, "error", logger.GetLogLevel())
		})

		t.Run("test fatal config (mixed case)", func(t *testing.T) {
			logger := New(Config{
				AppName: "TestConfig",
				Level:   "fAtAl",
			})

			require.False(t, logger.IsDebugEnabled())
			require.Equal(t, "fatal", logger.GetLogLevel())
		})

		t.Run("test unknown config", func(t *testing.T) {
			logger := New(Config{
				AppName: "TestConfig",
				Level:   "randomstring123",
			})

			require.False(t, logger.IsDebugEnabled())
			require.Equal(t, "info", logger.GetLogLevel())
		})

		t.Run("test default config", func(t *testing.T) {
			logger := New(Config{
				AppName: "TestConfig",
			})

			require.False(t, logger.IsDebugEnabled())
			require.Equal(t, "info", logger.GetLogLevel())
		})
	})

	t.Run("Test LogToFile", func(t *testing.T) {
		t.Run("test override output", func(t *testing.T) {
			var buf bytes.Buffer
			logger := New(Config{
				AppName: "TestConfig",
				Output:  &buf,
			})
			logMessage := "Testing a default log message"
			logger.Info(logMessage)
			require.Contains(t, buf.String(), "info")
			require.Contains(t, buf.String(), "Testing a default log message")
		})
	})
}
