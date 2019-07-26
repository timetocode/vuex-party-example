import Vue from 'vue'
import Vuex from 'vuex'
import {
	joinParty,
	createParty,
	leaveParty,
	kick,
	start,
	submitChange,
	partyEvents
} from 'party'


Vue.use(Vuex)

const updatePartyQuerystring = partyId => {
	let newurl = window.location.protocol + '//' + window.location.host;
	if (!partyId) {
		window.history.replaceState({ path: newurl }, '', newurl);
		return
	}
	newurl += '?party=' + partyId;
	window.history.replaceState({ path: newurl }, '', newurl);
}

const findMember = (state, id) => {
	return state.members.find(m => m.id === id)
}

export default new Vuex.Store({
	state: {
		socket: null,
		self: null, // b/c vue is limited with reactivity
		members: [],
		partyId: null,
		memberId: null,
		isPartyUIOpen: true
	},
	getters: {
		partyUrl(state) {
			return `http://localhost:8080/?party=${state.partyId}`
		},
		self(state) {
			return findMember(state, state.memberId)
		},
		isReady(state) {
			if (state.self && state.self.isReady) {
				return true
			}
			return false
		},
		isLeader(state) {
			if (state.self && state.self.isLeader) {
				return true
			}
			return false
		}
	},
	mutations: {
		reset(state) {
			state.socket = null
			state.members = []
			state.partyId = null
			state.memberId = null
			updatePartyQuerystring(state.partyId) // side effect
		},
		setSocket(state, socket) {
			state.socket = socket
		},
		setIdentity(state, payload) {
			state.partyId = payload.partyId
			state.memberId = payload.memberId
			state.isLeader = payload.isLeader
			updatePartyQuerystring(state.partyId)  // side effect
		},
		addMember(state, member) {
			const existingMember = findMember(state, member.id)
			if (!existingMember) {
				state.members.push(member)
			}

			if (member.id === state.memberId) {
				state.self = member
			}
		},
		updateMember(state, payload) {
			const member = findMember(state, payload.id)
			if (member) {
				member[payload.prop] = payload.value
			}
		},
		deleteMember(state, id) {
			const member = findMember(state, id)
			state.members.splice(state.members.indexOf(member), 1)
		}
	},
	actions: {
		createOrJoin({ commit }, partyId) {
			if (partyId) {
				const socket = joinParty(
					'ws://localhost:8888',
					partyId,
					window.localStorage.getItem('memberId')
				)

				commit('setSocket', socket)
			} else {
				const socket = createParty('ws://localhost:8888')
				commit('setSocket', socket)
			}

			partyEvents.on('identity', identity => {
				commit('setIdentity', identity)				
				window.localStorage.setItem('partyId', identity.partyId)
				window.localStorage.setItem('memberId', identity.memberId)
			})

			partyEvents.on('create', member => { commit('addMember', member) })
			partyEvents.on('update', (id, prop, value) => {
				commit('updateMember', { id, prop, value })
			})
			partyEvents.on('delete', id => { commit('deleteMember', id) })
			partyEvents.on('disconnect', () => { commit('reset') })
			partyEvents.on('party-not-found', () => { commit('reset') })
			partyEvents.on('start', payload => { console.log('start!', payload) })
			partyEvents.on('kicked', () => {
				// TODO probably tell the user something
				console.log('kicked by party leader')
				commit('reset')
			})
		},
		leaveParty({ state }) {
			leaveParty(state.socket)
		},
		start({ state }) {
			start(state.socket)
		},
		ready({ state }) {
			submitChange(state.socket, 'isReady', true)
		},
		unready({ state }) {
			submitChange(state.socket, 'isReady', false)
		},
		kick({ state }, id) {
			kick(state.socket, id)
		}
	}
})
