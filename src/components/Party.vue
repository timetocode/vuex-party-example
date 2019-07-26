<template>
  <div>
    <div>
      Invite:
      <input type="text" class="invite-text" :value="partyUrl" />
    </div>
    <div>PartyId: {{ partyId }}</div>
    <div>MemberId: {{ memberId }}</div>

    <div class="members">
      <div
        class="member"
        :class="{ self:member.id === memberId }"
        v-for="member in members"
        v-bind:key="member.id"
      >
        <!--<div>{{ member }}</div>-->
        <div class="actions">
          <span v-if="isLeader && member.id !== memberId">
            <button @click="kick(member.id)">
              <i class="fas fa-ban"></i>
            </button>
          </span>
        </div>

        <div class="portrait">
          <i class="fas fa-user-ninja fa-5x"></i>
        </div>

        <div>
          <div class="name">
            <span v-if="member.isLeader">
              <i class="fas fa-crown"></i>
            </span>
            <span>{{ member.name }}</span>
          </div>
        </div>

        <div class="ready-section">
          <span v-if="member.isReady" class="ready">
            <i class="fas fa-user-check"></i>
          </span>
          <span v-if="!member.isReady" class="not-ready">
            <i class="fas fa-user-times"></i>
          </span>
        </div>
      </div>
    </div>

    <span v-if="isLeader">
      <button @click="start()" class="start-game-button">Start Game</button>
    </span>

    <button v-if="!isReady" @click="ready()" class="ready-button">Ready</button>
    <button v-if="isReady" @click="unready()" class="unready-button">Cancel</button>

    <button @click="leaveParty()" class="leave-party-button">Leave Party</button>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  name: "Party",

  computed: {
    ...mapState(["socket", "partyUrl", "members", "partyId", "memberId"]),
    ...mapGetters(["partyUrl", "isReady", "isLeader", "self"])
  },
  methods: {
    ...mapActions(["start", "leaveParty", "ready", "unready", "kick"])
  }
};
</script>

<style scoped>
.invite-text {
  width: 220px;
  padding: 4px;
}

.member {
  position: relative;
  width: 132px;
  height: 200px;
  color: black;
  background-image: linear-gradient(
    to bottom right,
    rgb(212, 255, 255),
    rgb(148, 255, 250)
  );
  border: solid 2px #0e7c80;
  border-radius: 8px;
  margin: 8px;
  color: rgb(0, 0, 0);
}
.self {
  background-image: linear-gradient(
    to bottom right,
    rgb(255, 255, 255),
    rgb(166, 255, 251)
  );
  border: solid 2px #14bac0;
}

.portrait {
  width: 98px;
  height: 100px;
  margin: 16px;
  border: solid 1px rgb(182, 162, 72);
  background-color: rgb(255, 255, 255);
  color: pink;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.members {
  display: flex;
}

.name {
  display: flex;
  justify-content: center;
}

.actions {
  float: right;
}

.ready-section {
  margin-top: 4px;
  display: flex;
  justify-content: center;
  font-size: 12px;
}

.ready {
  color: rgb(182, 103, 0);
  font-size: 2em;
  margin: 4px;
}

.not-ready {
  color: rgb(0, 87, 87);
  font-size: 2em;
  margin: 4px;
}

.ready-button {
  /* */
}
.unready-button {
  /* */
}

.leave-party-button {
  /* */
}

.start-game-button,
.leave-party-button,
.unready-button,
.ready-button {
  background-image: linear-gradient(
    to bottom right,
    rgb(255, 233, 161),
    rgb(255, 113, 57)
  );
  color: rgb(36, 2, 0);
  padding: 8px 16px;
  font-size: 16px;
  font-weight: bold;
  border: solid 2px black;
  border-radius: 16px;
  margin: 8px;
  outline: none;
}

.start-game-button:hover,
.leave-party-button:hover,
.unready-button:hover,
.ready-button:hover {
  background-image: linear-gradient(
    to bottom right,
    rgb(134, 20, 0),
    rgb(185, 173, 0)
  );
  border: solid 2px rgb(255, 254, 170);
  color: rgb(255, 248, 185);
}
</style>
