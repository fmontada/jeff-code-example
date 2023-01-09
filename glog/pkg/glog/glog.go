package glog

import (
	"github.com/sirupsen/logrus"
	"io"
	"os"
	"strings"
)

type Formatter = logrus.Formatter

type Logger interface {
	IsDebugEnabled() bool
	GetLogLevel() string

	Trace(args ...interface{})
	Tracef(format string, args ...interface{})

	Debug(args ...interface{})
	Debugf(format string, args ...interface{})

	Info(args ...interface{})
	Infof(format string, args ...interface{})

	Warn(args ...interface{})
	Warnf(format string, args ...interface{})

	Error(args ...interface{})
	Errorf(format string, args ...interface{})

	Fatal(args ...interface{})
	Fatalf(format string, args ...interface{})
}

type logger struct {
	config Config
	log    logrus.Logger
}

type Config struct {
	AppName string
	Level   string
	Output  io.Writer
}

func New(config Config) *logger {
	log := logrus.Logger{
		Formatter: &logrus.JSONFormatter{},
	}

	if config.Output == nil {
		log.SetOutput(os.Stdout)
	} else {
		log.SetOutput(config.Output)
	}

	switch strings.ToUpper(config.Level) {
	case "TRACE":
		log.SetLevel(logrus.TraceLevel)
	case "DEBUG":
		log.SetLevel(logrus.DebugLevel)
	case "INFO":
		log.SetLevel(logrus.InfoLevel)
	case "WARN":
		log.SetLevel(logrus.WarnLevel)
	case "ERROR":
		log.SetLevel(logrus.ErrorLevel)
	case "FATAL":
		log.SetLevel(logrus.FatalLevel)
	default:
		log.SetLevel(logrus.InfoLevel)
	}

	return &logger{
		config: config,
		log:    log,
	}
}
