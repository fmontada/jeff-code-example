package app

import (
	"context"
	"encoding/json"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/sns"
	"github.com/aws/aws-sdk-go-v2/service/sns/types"
	"github.com/gap-commerce/srv-emberz/pkg/model"
)

func (a *App) SendContactEmail(ctx context.Context, accountID string, storeID string,
	input model.ContactInput) (*string, error) {
	payload := ContactEmailMessage{
		AccountID: accountID,
		StoreID:   storeID,
		Message:   *input.Message,
		Name:      *input.Name,
		Email:     *input.Email,
	}

	d, err := json.MarshalIndent(payload, "", "\t")
	if err != nil {
		a.Logger.Error(err)
		return nil, err
	}

	params := &sns.PublishInput{
		Message: aws.String(string(d)),
		MessageAttributes: map[string]types.MessageAttributeValue{
			"event_type": {
				DataType:    aws.String("String"),
				StringValue: aws.String("contact/business_owner"),
			},
			"publisher": {
				DataType:    aws.String("String"),
				StringValue: aws.String("gapcommerce"),
			},
		},
		Subject:  aws.String("contact owner"),
		TopicArn: aws.String(a.Config.TopicArn),
	}

	_, err = a.Services.SNS.Publish(ctx, params)
	if err != nil {
		a.Logger.Error(err)
		return nil, err
	}

	return input.Email, nil
}
