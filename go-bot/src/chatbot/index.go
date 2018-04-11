package chatbot

import (
	"fmt"
	"log"

	"../commons"
	"./handlers"
	"gopkg.in/telegram-bot-api.v4"
)

// Start a new chatbot
func Start() {
	commons.GetConfiguration()

	bot, err := tgbotapi.NewBotAPI(commons.Config.Telegram["bot_token"].(string))
	if err != nil {
		log.Panic(err)
	}
	bot.Debug = false

	log.Printf("Authorized on account %s", bot.Self.UserName)

	u := tgbotapi.NewUpdate(0)
	u.Timeout = 60

	updates, err := bot.GetUpdatesChan(u)

	for update := range updates {
		productChannel := make(chan commons.Product, 2)
		results := make(chan tgbotapi.MessageConfig)

		if update.Message == nil {
			continue
		}

		switch update.Message.Command() {
		case "getoffers":
			go handlers.GetOffers(update, productChannel, results)
		case "test":
			go handlers.SendInline(update, results)
		default:
			fmt.Printf(">>> default\n")
		}

		for msg := range results {
			bot.Send(msg)
		}
	}
}
