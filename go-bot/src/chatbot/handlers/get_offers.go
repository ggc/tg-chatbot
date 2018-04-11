package handlers

import (
	"../../commons"
	"../../scraper"

	"gopkg.in/telegram-bot-api.v4"
)

// GetOffers of ebay
func GetOffers(update tgbotapi.Update, productChannel chan commons.Product, results chan<- tgbotapi.MessageConfig) {

	go scraper.Start(productChannel)

	for offer := range productChannel {
		textMsg := offer.Name + "\n" + commons.FloatToStr(offer.Price) + "**\n" + offer.URL
		msg := tgbotapi.NewMessage(update.Message.Chat.ID, textMsg)
		results <- msg
	}
	close(results)
}
