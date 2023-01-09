package app

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/sns"
	"github.com/aws/aws-sdk-go-v2/service/sns/types"
	"github.com/gap-commerce/srv-emberz/pkg/model"
)

func (a *App) SubscribeToCrm(ctx context.Context, accountID string, storeID string, input model.SubscribeCRMInput) error {
	key := a.GetResourceKey(accountID, storeID, a.Config.AppKey)

	crmApps, err := a.Services.App.GetAllByCategory(ctx, model.AppCategoryTypeCrm, key)
	if err != nil {
		a.Logger.Error(err)

		return err
	}

	// get active crm app
	var activeCRMApp *model.App

	for i := range crmApps {
		status := crmApps[i].GetStatus()

		if status != nil && *status {
			activeCRMApp = &crmApps[i]

			break
		}
	}

	if activeCRMApp == nil {
		return errors.New("no crm apps configured")
	}

	if input.Email == nil && input.Phone == nil {
		return errors.New("at least email or phone must be provided")
	}

	body := SubscribeCRM{
		SubscribeCRMInput: input,
		AccountID:         accountID,
		StoreID:           storeID,
	}

	d, err := json.Marshal(body)
	if err != nil {
		return err
	}

	event := fmt.Sprintf("app/%s", (*activeCRMApp).GetHandler())

	params := &sns.PublishInput{
		Message: aws.String(string(d)),
		MessageAttributes: map[string]types.MessageAttributeValue{
			"event_type": {
				DataType:    aws.String("String"),
				StringValue: aws.String(event),
			},
			"publisher": {
				DataType:    aws.String("String"),
				StringValue: aws.String("gapcommerce"),
			},
		},
		Subject:  aws.String("app proccesing"),
		TopicArn: aws.String(a.Config.TopicArn),
	}

	if _, err = a.Services.SNS.Publish(ctx, params); err != nil {
		a.Logger.Error(err)

		return err
	}

	return nil
}
