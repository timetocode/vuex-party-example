const createPartyService = require('party')

createPartyService({
	SERVICE_ID: '1-',
	PARTY_ID_TOKEN_SIZE: 4,
	PLAYER_ID_TOKEN_SIZE: 8,
	port: 8888,
	idleTimeoutMs: 1000,
	tickIntervalMs: 2000,
	playerProperties: ['name', 'isReady'],
	validators: {
		name(value) {
			// TODO validate the input name instead of returning it!
			return value
		},
		isReady(value) {
			if (typeof value !== 'boolean') {
				return false
			} else {
				return value
			}			
		}
	},
	onStart: (party) => {
		// hardcoded for the demo, but in reality return one of your servers 
		// (query your server list or write a matchmaker)
		return {
			url: `https://us-west-5.sharkz.io/3`
		}
	}
})
