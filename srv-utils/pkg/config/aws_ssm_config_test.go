package config

import (
	"context"
	"errors"
	"strings"
	"testing"

	"github.com/aws/aws-sdk-go-v2/service/ssm"
	"github.com/aws/aws-sdk-go-v2/service/ssm/types"
	"github.com/gap-commerce/srv-utils/test"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestConfig_AwsSsm(t *testing.T) {
	t.Run("successfully load config from ssm", func(t *testing.T) {
		//Given
		mock := &test.MockEnvConfig{}

		awsSsm := &mockAwsSmmClient{}

		// When
		config := NewAwsSsmConfig([]string{"/test/", "/server/"}, awsSsm, mock)
		config.Load()

		// Then
		assert.NotNil(t, config)
		assert.Equal(t, "GapCommerce", mock.Name)
		assert.Equal(t, "Go", mock.Language)
		assert.Equal(t, "Aws", mock.Server)
	})

	t.Run("successfully load config from ssm with retry", func(t *testing.T) {
		//Given
		mock := &test.MockEnvConfig{}

		awsSsm := &mockAwsSmmClient{
			Retry: true,
		}

		// When
		config := NewAwsSsmConfig([]string{"/test/", "/server/"}, awsSsm, mock)
		config.Load()

		// Then
		assert.NotNil(t, config)
		assert.Equal(t, "GapCommerce", mock.Name)
		assert.Equal(t, "Go", mock.Language)
		assert.Equal(t, "Aws", mock.Server)
	})

	t.Run("failed load config from ssm retries exceeded", func(t *testing.T) {
		//Given
		mock := &test.MockEnvConfig{}

		awsSsm := &mockSSMFailed{}

		// When
		config := NewAwsSsmConfig([]string{"/test/", "/server/"}, awsSsm, mock)
		err := config.Load()

		// Then
		require.Error(t, err)
		assert.Equal(t, true, strings.Contains(err.Error(), ErrExceededAttempts))
	})
}

type mockAwsSmmClient struct {
	Retry   bool
	Success bool
}

func (c *mockAwsSmmClient) GetParametersByPath(ctx context.Context,
	params *ssm.GetParametersByPathInput,
	optFns ...func(options *ssm.Options)) (
	*ssm.GetParametersByPathOutput,
	error,
) {
	if c.Retry && !c.Success {
		c.Success = true

		return nil, errors.New(ErrExceededAttempts)
	}

	var param []types.Parameter
	name := "/test/name"
	nameValue := "GapCommerce"

	param = append(param, types.Parameter{
		Name:  &name,
		Value: &nameValue,
	})

	language := "/test/language"
	languageValue := "Go"
	param = append(param, types.Parameter{
		Name:  &language,
		Value: &languageValue,
	})

	languageName := "/test/language_name"
	languageNameValue := "Go"
	param = append(param, types.Parameter{
		Name:  &languageName,
		Value: &languageNameValue,
	})

	serverName := "/server/server_name"
	serverNameValue := "Aws"
	param = append(param, types.Parameter{
		Name:  &serverName,
		Value: &serverNameValue,
	})

	out := &ssm.GetParametersByPathOutput{
		Parameters: param,
	}
	return out, nil
}

type mockSSMFailed struct {
}

func (c *mockSSMFailed) GetParametersByPath(ctx context.Context,
	params *ssm.GetParametersByPathInput,
	optFns ...func(options *ssm.Options)) (
	*ssm.GetParametersByPathOutput,
	error,
) {

	return nil, errors.New(ErrExceededAttempts)
}
