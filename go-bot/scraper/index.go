package scraper

import (
	"fmt"
	"strings"

	"github.com/gocolly/colly"
)

// Start the scraper
func Start(msgChannel chan string) {
	fmt.Println("Starting scraping process...")
	c := colly.NewCollector()

	// c.OnHTML(".row-fluid", func(e *colly.HTMLElement) {
	c.OnHTML("div[id=result-set]", func(e *colly.HTMLElement) {
		fmt.Println("found a list of items")
		e.ForEach("div[data-item-id]", func(_ int, el *colly.HTMLElement) {
			fmt.Println("found an item inside")
			strikedPrice := el.ChildText(".strike")
			if strikedPrice == "" {
				return
			}
			itemID := el.Attr("data-item-id")
			name := el.ChildText(".title")
			currentPrice := el.ChildText(".curr")
			msgChannel <- strings.Join([]string{name, strikedPrice}, "\n")
			fmt.Printf("Content found: %q \n %s \n %s \n %s \n", itemID, name, currentPrice, strikedPrice)
		})
	})

	c.OnRequest(func(r *colly.Request) {
		fmt.Println("Visiting", r.URL)
	})

	fmt.Println("Ready to visit localhost:8080...")
	// ticker := time.NewTicker(5000 * time.Millisecond)
	// for t := range ticker.C {
	// fmt.Printf("[%02d:%02d:%02d]Tick! Visiting localhost:8080\n", t.Hour(), t.Minute(), t.Second())
	c.Visit("http://localhost:8080")
	// }
}
