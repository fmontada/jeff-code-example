package resolver

import (
	"context"
	"github.com/gap-commerce/srv-emberz/pkg/model"
)

func (r *mutationResolver) UploadFile(ctx context.Context,
	input model.FileUploadInput) (*model.FileUploadResponse, error) {
	url, headers, err := r.app.Services.FileUpload.UploadAssetsFile(ctx, input)
	if err != nil {
		r.app.Logger.Error(err)
		return nil, err
	}

	return &model.FileUploadResponse{
		Headers: r.app.GetHttpHeadersFrom(headers),
		URL:     *url,
	}, nil
}
