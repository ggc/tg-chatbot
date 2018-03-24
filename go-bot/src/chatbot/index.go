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
	cfg := commons.GetConfiguration()

	bot, err := tgbotapi.NewBotAPI(cfg.Telegram["bot_token"].(string))
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

		if update.Message == nil {
			continue
		}

		switch update.Message.Command() {
		case "getoffers":
			go handlers.GetOffers(productChannel)
		default:
			fmt.Printf(">>> default\n")
		}

		for offer := range productChannel {
			photo := tgbotapi.NewPhotoUpload(update.Message.Chat.ID, "./assets/images/OK_thumb.png")
			photo.Caption = offer.Name + " at " + commons.FloatToStr(offer.Price)
			log.Printf(">>> [sending] photo: %+v\n", photo)
			bot.Send(photo)
		}
	}
}
