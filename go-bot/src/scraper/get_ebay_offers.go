package scraper

import (
	"fmt"
	"strings"

	"../commons"
	"github.com/gocolly/colly"
)

func GetEbayOffers(productChannel chan commons.Product) {

	var victim string = "http://localhost:8080"

	c := colly.NewCollector()

	c.OnHTML("div[id=result-set]", func(e *colly.HTMLElement) {
		e.ForEach("div[data-item-id]", func(_ int, el *colly.HTMLElement) {
			strikedPrice := el.ChildText(".strike")
			if strikedPrice == "" {
				return
			}
			itemID := el.Attr("data-item-id")
			name := el.ChildText(".title")
			url := el.ChildAttr("img[src]", "src")
			currentPrice := el.ChildText(".curr")
			currentPrice = strings.Replace(currentPrice, " EUR", "", -1)
			currentPrice = strings.Replace(currentPrice, ",", ".", 1)
			product := commons.Product{
				Id:          itemID,
				Name:        name,
				Description: "no-data",
				Url:         url,
				Price:       commons.StrToFloat(currentPrice),
			}

			fmt.Printf("[SCRAPER] Product found: %+v\n", product)

			productChannel <- product
		})
		close(productChannel)

	})

	c.OnRequest(func(r *colly.Request) {
		fmt.Println("Visiting", r.URL)
	})

	fmt.Printf("[SCRAPER] Starting scraping process of %s\n", victim)
	c.Visit(victim)
}
