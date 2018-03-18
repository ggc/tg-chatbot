package main

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gocolly/colly"
	"github.com/gocolly/colly/debug"
	"gopkg.in/telegram-bot-api.v4"
)

func handler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "<h1 class='header'>Hello world!</h1>")
}

func main() {
	chatText := make(chan string)

	/* Start a server to provide content */
	go func() {
		http.HandleFunc("/", handler)
		fmt.Println("Server listening at 8080")
		log.Fatal(http.ListenAndServe(":8080", nil))
	}()

	/* Fetch the content */
	fmt.Println("Starting scraping process...")
	c := colly.NewCollector(
		colly.Async(true),
		colly.Debugger(&debug.LogDebugger{}),
	)

	c.OnHTML("h1", func(e *colly.HTMLElement) {
		head := e.Attr("class")
		chatText <- e.Text
		// Print head
		fmt.Printf("Head found: %q -> %s\n", e.Text, head)
	})

	c.OnRequest(func(r *colly.Request) {
		fmt.Println("Visiting", r.URL)
	})

	fmt.Println("Ready to visit localhost:8080...")
	ticker := time.NewTicker(5000 * time.Millisecond)
	go func() {
		for t := range ticker.C {
			fmt.Printf("[%d]Tick! Visiting localhost:8080\n", t)
			c.Visit("http://localhost:8080")
		}
	}()

	/* Start the chatbot */
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

		msg := tgbotapi.NewMessage(update.Message.Chat.ID, <-chatText)
		msg.ReplyToMessageID = update.Message.MessageID

		bot.Send(msg)
	}
}
