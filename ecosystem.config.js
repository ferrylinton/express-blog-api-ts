module.exports = {
	apps: [{
		"name": "blogapi",
		"script": "./dist/server.js",
		"instances": 1,
		"exec_mode": "fork",
		"max_restarts": 4,
		"min_uptime": 60000,
		"restart_delay": 10000
	}]
}
