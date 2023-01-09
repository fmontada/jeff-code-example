package gstat

import (
	"fmt"
	"github.com/gap-commerce/gstat/pkg/gstat/gstattest"

	"github.com/gap-commerce/glog/pkg/glog"
)

//client is a metrics client that can be configured to work with multiple metrics services.
type client struct {
	serviceName string
	metadata    map[string]string
	logger      glog.Logger
	dataDogAddr string
	nrInsertKey string
}

//NewClient creates a new client. Will return a null implementation by default.
//It will not log anything or send metrics anywhere. Pass in options to configure real functionality.
func NewClient(serviceName string, opts ...ClientOption) (Instrumentation, error) {
	client := &client{
		serviceName: serviceName,
		metadata: map[string]string{
			"service_name": serviceName,
		},
		logger: glog.NewDevNull(),
	}

	var err error
	for _, opt := range opts {
		err = opt(client)
		if err != nil {
			return nil, err
		}
	}

	if client.dataDogAddr != "" {
		return client.dataDogInit()
	}

	if client.nrInsertKey != "" {
		return client.newRelicInit()
	}

	return gstattest.NewDevNull(), nil
}

func (client *client) dataDogInit() (*dogStatsD, error) {
	prefix := fmt.Sprintf("gapcommerce.%s", client.serviceName)
	var tags []string
	for key, val := range client.metadata {
		tags = append(tags, fmt.Sprintf("%s:%s", key, val))
	}

	logger := client.logger

	return NewDogStatsD(client.dataDogAddr, prefix, logger, tags...)
}

func (client *client) newRelicInit() (*RelicStatsD, error) {
	labels := map[string]interface{}{}
	labels[ServiceNameKey] = client.serviceName

	for k, v := range client.metadata {
		labels[k] = interface{}(v)
	}

	return NewRelicStatsD(client.nrInsertKey, client.logger, labels)
}
