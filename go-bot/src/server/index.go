package server

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
)

func handler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "%s", readFile())
}

func readFile() []byte {
	dat, err := ioutil.ReadFile("assets/ebay_worten_item_list.html")
	if err != nil {
		log.Panic(err)
	}

	return dat
}

// Mock starts a local server for html test calls
func Mock(serverRunning chan bool) {
	http.HandleFunc("/", handler)
	fmt.Println("Server listening at 8080")
	serverRunning <- true
	log.Fatal(http.ListenAndServe(":8080", nil))
}
