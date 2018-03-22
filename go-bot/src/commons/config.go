package config

import (
	"fmt"
	"os"

	"github.com/BurntSushi/toml"
)

var (
	config string
	port   string
	env    string
	cfg    Config
)

type telegram struct {
	botToken string
}

// Config represents a configuration tree
type Config struct {
	Debug    bool
	Telegram map[string]interface{}
}

// GetConfiguration return the cfg singleton object
func GetConfiguration() Config {
	return cfg
}

func loadConfiguration(cfg *Config) {
	var confFile string

	config = "index"

	confFile = "config/" + config + ".toml"
	if _, err := os.Stat(confFile); err != nil {
		panic("Config file " + confFile + " is missing")
	}

	if port = os.Getenv("port"); port == "" {
		port = "8000"
	}

	if _, err := toml.DecodeFile(confFile, &cfg); err != nil {
		panic(err)
	}
}

func init() {
	loadConfiguration(&cfg)
	fmt.Printf("[COMMONS] Loaded configuration file: %+v\n", cfg)
}
