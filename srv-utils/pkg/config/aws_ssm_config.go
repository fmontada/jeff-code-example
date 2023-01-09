package config

import (
	"context"
	"reflect"
	"regexp"
	"strings"
	"time"

	"github.com/aws/aws-sdk-go-v2/service/ssm"
	"github.com/aws/aws-sdk-go-v2/service/ssm/types"
)

type AwsSsmClient interface {
	GetParametersByPath(ctx context.Context, params *ssm.GetParametersByPathInput, optFns ...func(*ssm.Options)) (*ssm.GetParametersByPathOutput, error)
}

const MaxRetries = 5
const MaxResults = 10

var ErrExceededAttempts = "operation error SSM: GetParametersByPath, exceeded maximum number of attempts"

type AwsSsmConfig struct {
	paths        []string
	awsSsmClient AwsSsmClient
	config       interface{}
}

func NewAwsSsmConfig(paths []string, client AwsSsmClient, config interface{}) *AwsSsmConfig {
	return &AwsSsmConfig{
		paths:        paths,
		awsSsmClient: client,
		config:       config,
	}
}

func (a *AwsSsmConfig) Load() error {
	ctx := context.Background()
	var parameters []types.Parameter

	retries := 0
	for i := range a.paths {
		path := a.paths[i]

		var nextToken *string
		retries = 0

		for {
			params := &ssm.GetParametersByPathInput{
				Path:           &path,
				MaxResults:     MaxResults,
				Recursive:      true,
				WithDecryption: false,
				NextToken:      nextToken,
			}

			param, err := a.awsSsmClient.GetParametersByPath(ctx, params)
			if err != nil {
				if strings.Contains(err.Error(), ErrExceededAttempts) && retries < MaxRetries {
					retries++
					time.Sleep(3 * time.Second)
					continue
				}

				return err
			}

			parameters = append(parameters, param.Parameters...)

			nextToken = param.NextToken

			if nextToken == nil {
				break
			}
		}
	}

	envMap := make(map[string]string)

	re, _ := regexp.Compile(`^\/.+\/`)
	for _, parameter := range parameters {
		name := re.ReplaceAllString(*parameter.Name, "")
		envMap[name] = *parameter.Value
	}

	ps := reflect.ValueOf(a.config).Elem()
	st := reflect.TypeOf(a.config).Elem()

	next := 0
	for next < st.NumField() {
		tag := st.Field(next)
		f := ps.FieldByName(tag.Name)

		if f.IsValid() {
			if f.CanSet() {
				f.SetString(envMap[tag.Tag.Get("env")])
			}
		}

		next++
	}
	return nil
}

func (a *AwsSsmConfig) Lookup(key string) (string, error) {
	st := reflect.TypeOf(a.config).Elem()

	next := 0
	for next < st.NumField() {
		tag := st.Field(next)

		if tag.Tag.Get("env") == key {
			ps := reflect.ValueOf(a.config).Elem()
			f := ps.FieldByName(tag.Name)
			return f.String(), nil
		}
		next++
	}
	return "", nil
}
