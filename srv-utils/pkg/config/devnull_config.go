package config

type DevNullConfig struct {}

func (e *DevNullConfig) NewDevNullConfig() *DevNullConfig{
	return &DevNullConfig{}
}

func (e *DevNullConfig) Lookup(key string) (string, error) {
	return "", nil
}

