module github.com/gap-commerce/srv-ecommerce

go 1.16

//replace github.com/gap-commerce/srv-emberz => ../srv-emberz

require (
	github.com/99designs/gqlgen v0.17.22
	github.com/aws/aws-lambda-go v1.24.0
	github.com/aws/aws-sdk-go-v2 v1.11.2
	github.com/aws/aws-sdk-go-v2/config v1.11.0
	github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue v1.2.1
	github.com/aws/aws-sdk-go-v2/feature/s3/manager v1.7.4
	github.com/aws/aws-sdk-go-v2/service/cognitoidentityprovider v1.6.1
	github.com/aws/aws-sdk-go-v2/service/dynamodb v1.5.1
	github.com/aws/aws-sdk-go-v2/service/s3 v1.22.0
	github.com/aws/aws-sdk-go-v2/service/sns v1.6.0
	github.com/awslabs/aws-lambda-go-api-proxy v0.10.0
	github.com/gap-commerce/glog v1.0.4
	github.com/gap-commerce/srv-emberz v1.54.0
	github.com/gap-commerce/srv-utils v1.0.3
	github.com/go-resty/resty/v2 v2.6.0
	github.com/google/uuid v1.2.0
	github.com/gorilla/mux v1.8.0
	github.com/gosimple/slug v1.12.0
	github.com/machinebox/graphql v0.2.2
	github.com/rs/xid v1.3.0
	github.com/stretchr/testify v1.7.1
	golang.org/x/crypto v0.0.0-20210921155107-089bfa567519
	golang.org/x/sync v0.0.0-20220722155255-886fb9371eb4
)
