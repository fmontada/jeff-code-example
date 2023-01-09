package test

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestLogRecorder(t *testing.T) {
	t.Run("record error message", func(t *testing.T) {
		// Given
		logger := NewLogRecorder()

		// When
		logger.Error("message")

		// Then
		assert.Equal(t, []string{"message"}, logger.Errors)
	})

	t.Run("contains specific error message", func(t *testing.T) {
		// Given
		logger := NewLogRecorder()

		// When
		logger.Error("message1")
		logger.Error("message2")
		logger.Error("message3")

		// Then
		assert.Contains(t, logger.Errors, "message2")
	})

	t.Run("record errorf message", func(t *testing.T) {
		// Given
		logger := NewLogRecorder()

		// When
		logger.Errorf("message %d", 123)

		// Then
		assert.Equal(t, []string{"message 123"}, logger.Errors)
	})

	t.Run("record 2 error message", func(t *testing.T) {
		// Given
		logger := NewLogRecorder()

		// When
		logger.Error("message1", "message2")

		// Then
		expected := []string{
			"message1",
			"message2",
		}
		assert.Equal(t, expected, logger.Errors)
	})

	t.Run("record error and info messages", func(t *testing.T) {
		// Given
		logger := NewLogRecorder()

		// When
		logger.Error("error message")
		logger.Info("info message")

		// Then
		assert.Equal(t, []string{"error message"}, logger.Errors)
		assert.Equal(t, []string{"info message"}, logger.Infos)
	})

	t.Run("error, info warn, trace, debug, fatal all work", func(t *testing.T) {
		// Given
		logger := NewLogRecorder()

		// When
		assertRecordsMessages(t, logger.Error, logger.Errorf, &logger.Errors, "Error")
		assertRecordsMessages(t, logger.Info, logger.Infof, &logger.Infos, "Info")
		assertRecordsMessages(t, logger.Warn, logger.Warnf, &logger.Warns, "Warn")
		assertRecordsMessages(t, logger.Trace, logger.Tracef, &logger.Traces, "Trace")
		assertRecordsMessages(t, logger.Debug, logger.Debugf, &logger.Debugs, "Debug")
		assertRecordsMessages(t, logger.Fatal, logger.Fatalf, &logger.Fatals, "Fatal")
	})

	t.Run("debug enabled and log level", func(t *testing.T) {
		// Given
		logger := NewLogRecorder()

		// Then
		assert.False(t, logger.IsDebugEnabled())
		assert.Equal(t, "", logger.GetLogLevel())
	})
}

func assertRecordsMessages(t *testing.T, w write, fw formatWrite, logs *[]string, name string) {
	t.Run(name, func(t *testing.T) {
		// Given
		message := name + "message"

		// When
		w(message)
		fw(message+" %d", 123)

		// Then
		assert.Equal(t, []string{message, message + " 123"}, *logs)
	})
}

type write func(args ...interface{})
type formatWrite func(format string, args ...interface{})