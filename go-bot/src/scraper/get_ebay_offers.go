package scraper

import (
	"fmt"
	"strings"

	"../commons"
	"github.com/gocolly/colly"
)

// GetEbayOffers scraps ebay's worten store
func GetEbayOffers(productChannel chan commons.Product) {

	var (
		limit = 5
	)

	// victim := "http://localhost:8080"
	// Worten store page IN ebay
	// victim := "http://stores.ebay.com/wortenespana/_i.html?_sop=15&rt=nc"
	// Ebay page
	victim := "https://www.ebay.com/sch/worten_es/m.html?_nkw=&_armrs=1&_ipg=&_from="

	c := colly.NewCollector()

	c.OnHTML("div[id=result-set]", func(e *colly.HTMLElement) {
		e.ForEach("div[data-item-id]", func(_ int, el *colly.HTMLElement) {
			strikedPrice := el.ChildText(".strike")
			if strikedPrice == "" {
				return
			}
			itemID := el.Attr("data-item-id")
			name := el.ChildText(".title")
			url := el.ChildAttr("a[href]", "href")
			imgURL := el.ChildAttr("img[src]", "src")
			currentPrice := el.ChildText(".curr")
			currentPrice = strings.Replace(currentPrice, " EUR", "", -1)
			currentPrice = strings.Replace(currentPrice, ",", ".", 1)
			product := commons.Product{
				ID:          itemID,
				Name:        name,
				Description: "no-data",
				URL:         url,
				ImgURL:      imgURL,
				Price:       commons.StrToFloat(currentPrice),
			}

			fmt.Printf("[SCRAPER] Product found: %#v\n", product)

			productChannel <- product
		})
		close(productChannel)

	})

	c.OnHTML("div[id=ResultSetItems]", func(e *colly.HTMLElement) {
		e.ForEach("li[id]", func(_ int, el *colly.HTMLElement) {
			if limit > 0 {
				limit--
			} else {
				return
			}

			strikedPrice := el.ChildText(".stk-thr")

			if strikedPrice == "" {
				return
			}
			itemID := el.Attr("id")
			name := el.ChildText("a[href]")
			url := el.ChildAttr("a[href]", "href")
			imgURL := el.ChildAttr("img[src]", "src")
			currentPrice := el.ChildText(".prc .bold") // Not cool
			currentPrice = strings.Replace(currentPrice, "$", "", -1)
			currentPrice = strings.TrimSpace(currentPrice)

			product := commons.Product{
				ID:          itemID,
				Name:        name,
				Description: "no-data",
				URL:         url,
				ImgURL:      imgURL,
				Price:       commons.StrToFloat(currentPrice),
			}

			fmt.Printf("[SCRAPER] Product found: %#v\n", product)

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
