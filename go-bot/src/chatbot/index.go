package chatbot

import (
	"fmt"
	"log"

	"../commons"

	"gopkg.in/telegram-bot-api.v4"
)

// Start a new chatbot
func Start(msgChannel chan string) {
	cfg := config.GetConfiguration()

	fmt.Println("Starting chatbot...")
	bot, err := tgbotapi.NewBotAPI(cfg.Telegram["bot_token"].(string))
	if err != nil {
		log.Panic(err)
	}

	bot.Debug = true

	log.Printf("Authorized on account %s", bot.Self.UserName)

	u := tgbotapi.NewUpdate(0)
	u.Timeout = 60

	updates, err := bot.GetUpdatesChan(u)
	msgChannel <- "Hello user!"

	for update := range updates {
		if update.Message == nil {
			continue
		}
		// Command

		log.Printf("[%s] %s", update.Message.From.UserName, update.Message.Text)
		for item := range msgChannel {
			log.Printf(">>> [sending] item: %+v", item)
			photo := tgbotapi.NewPhotoUpload(update.Message.Chat.ID, "./assets/images/OK_thumb.png")
			photo.Caption = "GET REKT"
			log.Printf(">>> [sending] photo: %+v", photo)
			msg := tgbotapi.NewMessage(update.Message.Chat.ID, item)
			log.Printf(">>> [sending] message: %+v", msg)
			bot.Send(photo)
		}
	}
}
