package main

import (
	"./chatbot"
	"./commons"
	"./server"
)

var cfg commons.Config

func main() {
	commons.GetConfiguration()

	serverRunning := make(chan bool)

	/* Start a server to provide content */
	go server.Mock(serverRunning)
	<-serverRunning

	/* Start the chatbot */
	chatbot.Start()
}
