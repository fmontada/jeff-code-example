package app

import (
	"github.com/gap-commerce/srv-emberz/pkg/model"
	"net/http"
)

func (a *App) GetHttpHeadersFrom(headers *http.Header) []*model.Header {
	if headers == nil {
		return []*model.Header{}
	}

	hds := make([]*model.Header, 0)

	for k, values := range *headers {
		for _, value := range values {
			hds = append(hds, &model.Header{
				Key:   k,
				Value: value,
			})
		}
	}

	return hds
}
