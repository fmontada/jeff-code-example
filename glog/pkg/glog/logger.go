package glog

import (
	"fmt"
	"github.com/sirupsen/logrus"
	"runtime"
	"strings"
)

const (
	maximumCallerDepth int    = 10
	minimumCallerDepth int    = 1
	ologPackageName    string = "olog."
)

func getCaller() (funcVal string, fileVal string) {

	// Restrict the lookback frames to avoid runaway lookups
	pcs := make([]uintptr, maximumCallerDepth)
	depth := runtime.Callers(minimumCallerDepth, pcs)
	frames := runtime.CallersFrames(pcs[:depth])

	for f, again := frames.Next(); again; f, again = frames.Next() {
		caller := &f

		funcVal := caller.Function
		if strings.Contains(funcVal, ologPackageName) {
			continue
		}

		fileVal := fmt.Sprintf("%s:%d", caller.File, caller.Line)
		return funcVal, fileVal
	}

	return "", ""
}

func shortenLogField(input string) (output string) {
	if !strings.Contains(input, "/go/") {
		return input
	}

	splitString := strings.Split(input, "/go/")
	return splitString[len(splitString)-1]
}

func getLogFields(o *logger, level logrus.Level) (fields logrus.Fields) {
	logrusFields := logrus.Fields{
		"service": o.config.AppName,
	}

	funcVal, fileVal := getCaller()
	if funcVal != "" {
		logrusFields["xfunc"] = shortenLogField(funcVal)
	}
	if fileVal != "" {
		logrusFields["xfile"] = shortenLogField(fileVal)
	}

	return logrusFields
}

func log(o *logger, level logrus.Level, args ...interface{}) {
	if len(args) == 0 {
		return
	}

	o.log.WithFields(getLogFields(o, level)).Log(level, args...)
}

func logf(o *logger, level logrus.Level, format string, args ...interface{}) {
	if len(args) == 0 {
		return
	}
	o.log.WithFields(getLogFields(o, level)).Logf(level, format, args...)
}

func (o *logger) IsDebugEnabled() bool {
	return o.log.IsLevelEnabled(logrus.DebugLevel)
}

func (o *logger) GetLogLevel() string {
	return o.log.Level.String()
}

func (o *logger) Trace(args ...interface{}) {
	log(o, logrus.TraceLevel, args...)
}

func (o *logger) Tracef(format string, args ...interface{}) {
	logf(o, logrus.TraceLevel, format, args...)
}

func (o *logger) Debug(args ...interface{}) {
	log(o, logrus.DebugLevel, args...)
}

func (o *logger) Debugf(format string, args ...interface{}) {
	logf(o, logrus.DebugLevel, format, args...)
}

func (o *logger) Info(args ...interface{}) {
	log(o, logrus.InfoLevel, args...)
}

func (o *logger) Infof(format string, args ...interface{}) {
	logf(o, logrus.InfoLevel, format, args...)
}

func (o *logger) Warn(args ...interface{}) {
	log(o, logrus.WarnLevel, args...)
}

func (o *logger) Warnf(format string, args ...interface{}) {
	logf(o, logrus.WarnLevel, format, args...)
}

func (o *logger) Error(args ...interface{}) {
	log(o, logrus.ErrorLevel, args...)
}

func (o *logger) Errorf(format string, args ...interface{}) {
	logf(o, logrus.ErrorLevel, format, args...)
}

func (o *logger) Fatal(args ...interface{}) {
	log(o, logrus.FatalLevel, args...)
}

func (o *logger) Fatalf(format string, args ...interface{}) {
	logf(o, logrus.FatalLevel, format, args...)
}
