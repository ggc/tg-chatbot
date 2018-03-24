package handlers

import (
	"../../commons"
	"../../scraper"
)

func GetOffers(productChannel chan commons.Product) {
	scraper.Start(productChannel)
}
