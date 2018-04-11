package main

import (
	"./chatbot"
	"./server"
)

func main() {
	serverRunning := make(chan bool)

	/* Start a server to provide content */
	go server.Mock(serverRunning)
	<-serverRunning

	/* Start the chatbot */
	chatbot.Start()
}
