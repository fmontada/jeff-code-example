package gstat

import (
	"errors"
	"fmt"
	"github.com/gap-commerce/glog/pkg/glog"
)

const (
	ServiceBuildDateKey  = "service.build.date"
	ServiceEnvKey        = "service.configs"
	ServiceNameKey       = "service.name"
	ServiceNamespaceKey  = "service.namespace"
	ServiceInstanceIDKey = "service.instance.id"
	ServiceVersionKey    = "service.version"
)

const (
	RelicKeyMissing GstatError = "a New Relic Insights Insert key is required"
)

//ClientOption is a function that configures a metrics client.
type ClientOption func(*client) error

//WithBuild adds metadata about the build when sending metrics.
func WithBuild(version, buildDate string) ClientOption {
	return func(client *client) error {
		if version == "" || buildDate == "" {
			return errors.New("must provides values for version and buildDate")
		}
		client.metadata[ServiceVersionKey] = version
		client.metadata[ServiceBuildDateKey] = buildDate

		return nil
	}
}

//WithEnv adds metadata about the configs when sending metrics.
func WithEnv(env string) ClientOption {
	return func(client *client) error {
		if env == "" {
			return errors.New("must provides configs")
		}
		client.metadata[ServiceEnvKey] = env

		return nil
	}
}

//WithLogger configures an glog.Logger instance.
func WithLogger(logger glog.Logger) ClientOption {
	return func(client *client) error {
		client.logger = logger
		return nil
	}
}

//WithDatadog sends metrics to Datadog.
func WithDatadog(host, port string) ClientOption {
	return func(client *client) error {
		if host == "" || port == "" {
			return fmt.Errorf("must provides values for host and port")
		}

		client.dataDogAddr = fmt.Sprintf("%s:%s", host, port)

		return nil
	}
}

// WithNewRelic sends metrics to New Relic.
func WithNewRelic(insertKey string) ClientOption {
	return func(client *client) error {
		if insertKey == "" {
			return RelicKeyMissing
		}

		client.nrInsertKey = insertKey

		return nil
	}
}
