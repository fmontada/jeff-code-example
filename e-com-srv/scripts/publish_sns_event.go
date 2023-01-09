package main

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/sns"
	"github.com/aws/aws-sdk-go-v2/service/sns/types"
	"github.com/gap-commerce/srv-ecommerce/internal/app"
)

func main() {
	// config
	ctx := context.Background()
	awsConfig, err := config.LoadDefaultConfig(ctx, config.WithRegion("us-west-1"))
	if err != nil {
		fmt.Println(err)
	}

	awsSns := sns.NewFromConfig(awsConfig)

	payload := app.OrderSNSPayload{
		AccountID: "cNoDolgzGY",
		StoreID:   "J2eRY5exTz",
		EntityID:  "53af7845-e02d-422f-87c2-9fb0568292a8", //ac57030c-b4fc-4818-a2a7-1689565f4dc3
	}
	eventType := "order/completed" //"order/confirm_notify" //"order/completed"
	topicArn := "arn:aws:sns:us-west-1:188323072404:gc-topic"

	d, err := json.MarshalIndent(payload, "", "\t")
	if err != nil {
		fmt.Println(err)
	}

	params := &sns.PublishInput{
		Message: aws.String(string(d)),
		MessageAttributes: map[string]types.MessageAttributeValue{
			"event_type": {
				DataType:    aws.String("String"),
				StringValue: aws.String(eventType),
			},
			"publisher": {
				DataType:    aws.String("String"),
				StringValue: aws.String("gapcommerce"),
			},
		},
		Subject:  aws.String("order complete"),
		TopicArn: aws.String(topicArn),
	}

	_, err = awsSns.Publish(ctx, params)
	if err != nil {
		fmt.Println(err)
	}

	fmt.Println("Event sent")
}
