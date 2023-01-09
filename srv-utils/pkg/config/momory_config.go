package config

import (
	"encoding/json"
	"fmt"
	"gopkg.in/yaml.v3"
	"os"
	"path/filepath"
	"reflect"
)

type InMemoryConfig struct {
	envFilePath string
	config interface{}
}

func NewInMemoryConfig(envFilePath string, config interface{}) (*InMemoryConfig, error) {
	i := &InMemoryConfig{
		envFilePath: envFilePath,
		config:      config,
	}

	err := i.load()
	if err != nil {
		return nil, err
	}
	return i, nil
}

func (e *InMemoryConfig) load() error {
	data, err := readFile(e.envFilePath)
	if err != nil {
		return err
	}

	ext := filepath.Ext(e.envFilePath)
	switch ext {
	case ".yml":
		err = yaml.Unmarshal(data, e.config)
		break
	case ".json":
		err = json.Unmarshal(data, e.config)
		break
	case ".env":
		err = e.loadFromEnvFile()
		break
	default:
		return fmt.Errorf(fmt.Sprintf("the file extension %s is not supported", ext))
	}

	return err
}

func (e *InMemoryConfig) loadFromEnvFile() error{
	file, err := os.Open(e.envFilePath)
	if err != nil {
		return err
	}
	defer file.Close()

	envMap, err := parse(file)
	if err != nil {
		return err
	}

	ps := reflect.ValueOf(e.config).Elem()
	st := reflect.TypeOf(e.config).Elem()

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

func (e *InMemoryConfig) Lookup(key string) (string, error) {
	st := reflect.TypeOf(e.config).Elem()

	next := 0
	for next < st.NumField() {
		tag := st.Field(next)

		if tag.Tag.Get("env") == key {
			ps := reflect.ValueOf(e.config).Elem()
			f := ps.FieldByName(tag.Name)
			return f.String(), nil
		}
		next++
	}
	return "", nil
}


