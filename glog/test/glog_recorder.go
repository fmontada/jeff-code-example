package test
import (
	"fmt"
)

type logRecorder struct {
	Errors []string
	Infos  []string
	Warns  []string
	Traces []string
	Debugs []string
	Fatals []string
}

func NewLogRecorder() *logRecorder {
	return &logRecorder{}
}

func (b *logRecorder) IsDebugEnabled() bool {
	return false
}

func (b *logRecorder) GetLogLevel() string {
	return ""
}

func (b *logRecorder) Trace(args ...interface{}) {
	b.save(&b.Traces, args...)
}

func (b *logRecorder) Tracef(format string, args ...interface{}) {
	b.savef(&b.Traces, format, args...)
}

func (b *logRecorder) Debug(args ...interface{}) {
	b.save(&b.Debugs, args...)
}

func (b *logRecorder) Debugf(format string, args ...interface{}) {
	b.savef(&b.Debugs, format, args...)
}

func (b *logRecorder) Info(args ...interface{}) {
	b.save(&b.Infos, args...)
}

func (b *logRecorder) Infof(format string, args ...interface{}) {
	b.savef(&b.Infos, format, args...)
}

func (b *logRecorder) Warn(args ...interface{}) {
	b.save(&b.Warns, args...)
}

func (b *logRecorder) Warnf(format string, args ...interface{}) {
	b.savef(&b.Warns, format, args...)
}

func (b *logRecorder) Error(args ...interface{}) {
	b.save(&b.Errors, args...)
}

func (b *logRecorder) Errorf(format string, args ...interface{}) {
	b.savef(&b.Errors, format, args...)
}

func (b *logRecorder) Fatal(args ...interface{}) {
	b.save(&b.Fatals, args...)
}

func (b *logRecorder) Fatalf(format string, args ...interface{}) {
	b.savef(&b.Fatals, format, args...)
}

func (b *logRecorder) save(lines *[]string, args ...interface{}) {
	for _, arg := range args {
		*lines = append(*lines, fmt.Sprint(arg))
	}
}

func (b *logRecorder) savef(lines *[]string, format string, args ...interface{}) {
	*lines = append(*lines, fmt.Sprintf(format, args...))
}