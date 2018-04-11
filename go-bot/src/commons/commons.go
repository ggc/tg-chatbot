package commons

import (
	"fmt"
	"os"
	"strconv"

	"github.com/BurntSushi/toml"
)

// Config is a Singleton of the configuration object
var (
	config string
	port   string
	env    string
	Config Configuration
)

type telegram struct {
	botToken string
}

// Configuration represents a configuration tree
type Configuration struct {
	Debug    bool
	Telegram map[string]interface{}
}

// Product contains the basic model for products shown
type Product struct {
	Description string
	ID          string
	ImgURL      string
	Name        string
	Price       float64
	URL         string
}

// Facets contains filters used in queries
type Facets struct {
	Price  float64
	Count  int
	Offset int
}

// FloatToStr parses a X.XX float to string
func FloatToStr(fv float64) string {
	return strconv.FormatFloat(fv, 'f', 2, 64)
}

// StrToFloat parses a string to a full built float64
func StrToFloat(s string) float64 {
	if f, err := strconv.ParseFloat(s, 64); err == nil {
		return f
	}
	return 0
}

// GetConfiguration return the Config singleton object
func GetConfiguration() Configuration {
	return Config
}

func loadConfiguration(Config *Configuration) {
	var confFile string

	config = "index"

	confFile = "config/" + config + ".toml"
	if _, err := os.Stat(confFile); err != nil {
		panic("Configuration file " + confFile + " is missing")
	}

	if port = os.Getenv("port"); port == "" {
		port = "8000"
	}

	if _, err := toml.DecodeFile(confFile, &Config); err != nil {
		panic(err)
	}
}

func init() {
	loadConfiguration(&Config)
	fmt.Printf("[COMMONS] Loaded configuration file: %+v\n", Config)
}
