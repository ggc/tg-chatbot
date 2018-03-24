package scraper

import (
	"../commons"
)

// Start the scraper
func Start(productChannel chan commons.Product) {
	GetEbayOffers(productChannel)
}
