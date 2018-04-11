package handlers

import (
	"fmt"

	"gopkg.in/telegram-bot-api.v4"
)

// NewReplyKeyboard
//
// InlineKeyboardMarkup
// InlineKeyboardButton

var numericKeyboard = tgbotapi.NewReplyKeyboard(
	tgbotapi.NewKeyboardButtonRow(
		tgbotapi.NewKeyboardButton("1"),
		tgbotapi.NewKeyboardButton("2"),
		tgbotapi.NewKeyboardButton("3"),
	),
	tgbotapi.NewKeyboardButtonRow(
		tgbotapi.NewKeyboardButton("1"),
		tgbotapi.NewKeyboardButton("4"),
		tgbotapi.NewKeyboardButton("6"),
	),
)

// SendInline sends a test keyboard (NO-INLINE)
func SendInline(update tgbotapi.Update, results chan<- tgbotapi.MessageConfig) {

	msg := tgbotapi.NewMessage(update.Message.Chat.ID, "How many offers?")
	msg.ReplyMarkup = numericKeyboard
	fmt.Printf(">>> Ready to send keyboard: %+v\n", numericKeyboard)

	results <- msg
	close(results)
}
