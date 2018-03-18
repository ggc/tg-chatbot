package main

import (
	"fmt"
	"log"
	"strings"

	"./server"
	"github.com/gocolly/colly"
	"gopkg.in/telegram-bot-api.v4"
)

func main() {
	chatText := make(chan string, 10)
	serverRunning := make(chan bool)

	/* Start a server to provide content */
	go server.Mock(serverRunning)
	<-serverRunning

	/* Fetch the content */
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
			chatText <- strings.Join([]string{name, strikedPrice}, "\n")
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

	// /* Start the chatbot */
	fmt.Println("Starting chatbot...")
	bot, err := tgbotapi.NewBotAPI("<botToken>")
	if err != nil {
		log.Panic(err)
	}

	bot.Debug = true

	log.Printf("Authorized on account %s", bot.Self.UserName)

	u := tgbotapi.NewUpdate(0)
	u.Timeout = 60

	updates, err := bot.GetUpdatesChan(u)

	for update := range updates {
		if update.Message == nil {
			continue
		}

		log.Printf("[%s] %s", update.Message.From.UserName, update.Message.Text)
		for item := range chatText {
			msg := tgbotapi.NewMessage(update.Message.Chat.ID, item)
			bot.Send(msg)
		}
	}
}
