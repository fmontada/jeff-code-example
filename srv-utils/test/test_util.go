package test

const DataBasePath = "../../test/testdata/"

type MockYmlConfig struct {
	Name     string `yaml:"name"`
	Language string `yaml:"language"`
}

type MockEnvConfig struct {
	Name     string `env:"name"`
	Language string `env:"language"`
	Server   string `env:"server_name"`
}
