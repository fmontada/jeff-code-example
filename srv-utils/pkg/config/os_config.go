package config

import (
	"fmt"
	"os"
	"path/filepath"
)

type InOsConfig struct {
	envFilePath string
	config interface{}
}

func NewInOsConfig(envFilePath string) (*InOsConfig, error) {
	i := &InOsConfig{
		envFilePath: envFilePath,
	}

	err := i.load()
	if err != nil {
		return nil, err
	}
	return i, nil
}

func (e *InOsConfig) Lookup(key string) (string, error) {
	return os.Getenv(key), nil
}

func (e *InOsConfig) load() error {
	var err error
	ext := filepath.Ext(e.envFilePath)
	switch ext {
	case ".env":
		err = e.loadFromEnvFile()
		break
	default:
		return fmt.Errorf(fmt.Sprintf("the file extension %s is not supported", ext))
	}

	return err
}

func (e *InOsConfig) loadFromEnvFile() error{
	file, err := os.Open(e.envFilePath)
	if err != nil {
		return err
	}
	defer file.Close()

	envMap, err := parse(file)
	for key, value := range envMap {
		os.Setenv(key, value)
	}

	return nil
}