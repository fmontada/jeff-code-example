package glog

import (
	"bytes"
	"fmt"
	"github.com/stretchr/testify/require"
	"testing"
)

func writeLogLines(logger Logger) {
	logger.Trace("standard trace message")
	logger.Tracef("trace message with a number %d", 123)
	logger.Debug("standard debug message")
	logger.Debugf("debug message with a number %d", 123)
	logger.Info("standard info message")
	logger.Infof("info message with a number %d", 123)
	logger.Warn("standard warn message")
	logger.Warnf("warn message with a number %d", 123)
	logger.Error("standard error message")
	logger.Errorf("error message with a number %d", 123)
	logger.Fatal("standard fatal message")
	logger.Fatalf("fatal message with a number %d", 123)
}

func initLogger(level string) (Logger, *bytes.Buffer) {
	var buf bytes.Buffer

	logger := New(Config{
		AppName: "TestLogger unit test",
		Level:   level,
		Output:  &buf,
	})

	return logger, &buf
}

func hasLogs(t *testing.T, logFileContent string, logLevel string) {
	require.Contains(t, logFileContent, fmt.Sprintf("standard %s message", logLevel))
	require.Contains(t, logFileContent, fmt.Sprintf("%s message with a number 123", logLevel), logLevel)
}

func missingLogs(t *testing.T, logFileContent string, logLevel string) {
	require.NotContains(t, logFileContent, fmt.Sprintf("standard %s message", logLevel))
	require.NotContains(t, logFileContent, fmt.Sprintf("%s message with a number 123", logLevel), logLevel)
}

func TestLogger(t *testing.T) {
	t.Run("Test contains service, line, and function info", func(t *testing.T) {
		logger, buf := initLogger("trace")
		writeLogLines(logger)
		logFileContent := buf.String()

		require.Contains(t, logFileContent, "TestLogger unit test")
		require.Contains(t, logFileContent, "glog/logger.go:20")
	})

	t.Run("Test logging lines with no args does not write to file", func(t *testing.T) {
		logger, buf := initLogger("debug")
		logger.Debug()
		logger.Debugf("debug message with a number %d")
		logFileContent := buf.String()

		require.Equal(t, "", logFileContent)
	})

	t.Run("Test trace methods", func(t *testing.T) {
		logger, buf := initLogger("trace")
		writeLogLines(logger)
		logFileContent := buf.String()

		require.Equal(t, "trace", logger.GetLogLevel())
		require.True(t, logger.IsDebugEnabled())
		hasLogs(t, logFileContent, "trace")
		hasLogs(t, logFileContent, "debug")
		hasLogs(t, logFileContent, "info")
		hasLogs(t, logFileContent, "warn")
		hasLogs(t, logFileContent, "error")
		hasLogs(t, logFileContent, "fatal")
	})

	t.Run("Test debug methods", func(t *testing.T) {
		logger, buf := initLogger("debug")
		writeLogLines(logger)
		logFileContent := buf.String()

		require.Equal(t, "debug", logger.GetLogLevel())
		require.True(t, logger.IsDebugEnabled())
		missingLogs(t, logFileContent, "trace")
		hasLogs(t, logFileContent, "debug")
		hasLogs(t, logFileContent, "info")
		hasLogs(t, logFileContent, "warn")
		hasLogs(t, logFileContent, "error")
		hasLogs(t, logFileContent, "fatal")
	})

	t.Run("Test info methods", func(t *testing.T) {
		logger, buf := initLogger("info")
		writeLogLines(logger)
		logFileContent := buf.String()

		require.Equal(t, "info", logger.GetLogLevel())
		require.False(t, logger.IsDebugEnabled())
		missingLogs(t, logFileContent, "trace")
		missingLogs(t, logFileContent, "debug")
		hasLogs(t, logFileContent, "info")
		hasLogs(t, logFileContent, "warn")
		hasLogs(t, logFileContent, "error")
		hasLogs(t, logFileContent, "fatal")
	})

	t.Run("Test warn methods", func(t *testing.T) {
		logger, buf := initLogger("warn")
		writeLogLines(logger)
		logFileContent := buf.String()

		require.Equal(t, "warning", logger.GetLogLevel())
		require.False(t, logger.IsDebugEnabled())
		missingLogs(t, logFileContent, "trace")
		missingLogs(t, logFileContent, "debug")
		missingLogs(t, logFileContent, "info")
		hasLogs(t, logFileContent, "warn")
		hasLogs(t, logFileContent, "error")
		hasLogs(t, logFileContent, "fatal")
	})

	t.Run("Test error methods", func(t *testing.T) {
		logger, buf := initLogger("error")
		writeLogLines(logger)
		logFileContent := buf.String()

		require.Equal(t, "error", logger.GetLogLevel())
		require.False(t, logger.IsDebugEnabled())
		missingLogs(t, logFileContent, "trace")
		missingLogs(t, logFileContent, "debug")
		missingLogs(t, logFileContent, "info")
		missingLogs(t, logFileContent, "warn")
		hasLogs(t, logFileContent, "error")
		hasLogs(t, logFileContent, "fatal")
	})

	t.Run("Test fatal methods", func(t *testing.T) {
		logger, buf := initLogger("fatal")
		writeLogLines(logger)
		logFileContent := buf.String()

		require.Equal(t, "fatal", logger.GetLogLevel())
		require.False(t, logger.IsDebugEnabled())
		missingLogs(t, logFileContent, "trace")
		missingLogs(t, logFileContent, "debug")
		missingLogs(t, logFileContent, "info")
		missingLogs(t, logFileContent, "warn")
		missingLogs(t, logFileContent, "error")
		hasLogs(t, logFileContent, "fatal")
	})
}
