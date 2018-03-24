package commons

import (
	"fmt"
	"os"
	"strconv"

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

type Product struct {
	Id          string
	Name        string
	Description string
	Url         string
	Price       float64
}

func FloatToStr(fv float64) string {
	return strconv.FormatFloat(fv, 'f', 2, 64)
}

func StrToFloat(s string) float64 {
	if f, err := strconv.ParseFloat(s, 64); err == nil {
		return f
	}
	return 0
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
