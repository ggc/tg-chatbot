package chatbot

import (
	"gopkg.in/telegram-bot-api.v4"
)

var numericKeyboardInline = tgbotapi.NewInlineKeyboardMarkup(
	tgbotapi.NewInlineKeyboardRow(
		tgbotapi.NewInlineKeyboardButtonURL("1", "https://www.google.pt"),
		tgbotapi.NewInlineKeyboardButtonURL("2", "https://www.google.pt"),
		tgbotapi.NewInlineKeyboardButtonURL("3", "https://www.google.pt"),
	),
	tgbotapi.NewInlineKeyboardRow(
		tgbotapi.NewInlineKeyboardButtonURL("4", "https://www.google.pt"),
		tgbotapi.NewInlineKeyboardButtonURL("5", "https://www.google.pt"),
		tgbotapi.NewInlineKeyboardButtonURL("6", "https://www.google.pt"),
	),
)

var numericKeyboard = tgbotapi.NewReplyKeyboard(
	tgbotapi.NewKeyboardButtonRow(
		tgbotapi.NewKeyboardButton("1"),
		tgbotapi.NewKeyboardButton("2"),
		tgbotapi.NewKeyboardButton("3"),
	),
	tgbotapi.NewKeyboardButtonRow(
		tgbotapi.NewKeyboardButton("4"),
		tgbotapi.NewKeyboardButton("5"),
		tgbotapi.NewKeyboardButton("6"),
	),
)

func main() {

}
