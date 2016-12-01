let request = require('request')

module.exports.listIssues = (req, res) => {
	requestOptions = {
		url: 'https://api.github.com/repos/oka-haist/pomodoritbot/issues',
		headers: {
			'User-Agent': 'oka-haist'
		}
	}
	// ?access_token=' + req.session.oauth
	request(requestOptions, (error, response, body) => {
		// console.log('body', body)
		// console.log('parsed body url: ', JSON.parse(body)[0].url)
		if(error){
			sendJSONresponse(res, 400, error)
			return;
		}
		sendJSONresponse(res, 200, body)

	})
}

let sendJSONresponse = (res, status, content) => {
	res.status(status)
	res.json(content)
}