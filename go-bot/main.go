package main

import (
	"fmt"
	"log"

	"./scraper"
	"./server"
	"gopkg.in/telegram-bot-api.v4"
)

func main() {
	msgChannel := make(chan string, 10)
	serverRunning := make(chan bool)

	/* Start a server to provide content */
	go server.Mock(serverRunning)
	<-serverRunning

	/* Fetch the content */
	scraper.Start(msgChannel)

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
		for item := range msgChannel {
			msg := tgbotapi.NewMessage(update.Message.Chat.ID, item)
			bot.Send(msg)
		}
	}
}
