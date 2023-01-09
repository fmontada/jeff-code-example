package config

import (
	"fmt"
	"github.com/gap-commerce/srv-utils/test"
	"github.com/stretchr/testify/require"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestConfig_InMemoryConfig(t *testing.T) {
	t.Run("successfully load config from yml file", func(t *testing.T) {
		//Given
		mock := &test.MockYmlConfig{}
		envFilePath := fmt.Sprintf("%s%s", test.DataBasePath, "config.yml")

		// When
		config, err := NewInMemoryConfig(envFilePath, mock)

		// Then
		require.NoError(t, err)
		assert.NotNil(t, config)
		assert.Equal(t, "GapCommerce", mock.Name)
		assert.Equal(t, "Go", mock.Language)
	})

	t.Run("successfully load config from json file", func(t *testing.T) {
		//Given
		mock := &test.MockYmlConfig{}
		envFilePath := fmt.Sprintf("%s%s", test.DataBasePath, "config.json")

		// When
		config, err := NewInMemoryConfig(envFilePath, mock)

		// Then
		require.NoError(t, err)
		assert.NotNil(t, config)
		assert.Equal(t, "GapCommerce", mock.Name)
		assert.Equal(t, "Go", mock.Language)
	})

	t.Run("successfully lookup env by the env name", func(t *testing.T) {
		//Given
		mock := &test.MockEnvConfig{}
		envFilePath := fmt.Sprintf("%s%s", test.DataBasePath, "config.json")

		// When
		config, err := NewInMemoryConfig(envFilePath, mock)

		// Then
		require.NoError(t, err)
		assert.NotNil(t, config)

		name, err := config.Lookup("name")
		require.NoError(t, err)

		language, err := config.Lookup("language")
		require.NoError(t, err)

		assert.Equal(t, "GapCommerce", name)
		assert.Equal(t, "Go", language)
	})

	t.Run("successfully load config from env file", func(t *testing.T) {
		//Given
		mock := &test.MockEnvConfig{}
		envFilePath := fmt.Sprintf("%s%s", test.DataBasePath, ".env")

		// When
		config, err := NewInMemoryConfig(envFilePath, mock)

		// Then
		require.NoError(t, err)
		assert.NotNil(t, config)
		assert.Equal(t, "GapCommerce", mock.Name)
		assert.Equal(t, "Go", mock.Language)
	})

	t.Run("error because the file extension is not supported", func(t *testing.T) {
		//Given
		mock := &test.MockYmlConfig{}
		envFilePath := fmt.Sprintf("%s%s", test.DataBasePath, "config.no_valid")

		// When
		_, err := NewInMemoryConfig(envFilePath, mock)

		// Then
		assert.NotNil(t, err)
		assert.Equal(t, "the file extension .no_valid is not supported", err.Error())

	})

	t.Run("error because the file does not exist", func(t *testing.T) {
		//Given
		mock := &test.MockYmlConfig{}
		envFilePath := fmt.Sprintf("%s%s", test.DataBasePath, "config.empty")

		// When
		_, err := NewInMemoryConfig(envFilePath, mock)

		// Then
		assert.NotNil(t, err)
		assert.Equal(t, fmt.Sprintf("open %s: no such file or directory", envFilePath), err.Error())

	})
}
