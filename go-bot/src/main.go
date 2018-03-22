package main

import (
	"./chatbot"
	"./commons"
)

var cfg config.Config

func main() {
	config.GetConfiguration()

	msgChannel := make(chan string, 10)
	// serverRunning := make(chan bool)

	/* Start a server to provide content */
	// go server.Mock(serverRunning)
	// <-serverRunning

	/* Fetch the content */
	// scraper.Start(msgChannel)

	// /* Start the chatbot */
	chatbot.Start(msgChannel)
}
