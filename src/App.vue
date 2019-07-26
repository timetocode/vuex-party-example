<template>
  <div id="app">
    <button v-if="!partyId" @click="createOrJoin()">Create Party</button>
    <Party v-if='partyId'/>
  </div>
</template>

<script>
import Party from "./components/Party.vue";
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  name: "app",
  components: {
    Party
  },
  data() {
    return {
      showCreatePartyButton: false
    };
  },
  computed: {
    ...mapState(["partyId"])
  },
  methods: {
    ...mapActions(["createOrJoin"])
  },
  created() {
    const urlParams = new URLSearchParams(window.location.search);
    const partyId = urlParams.get("party");

    if (partyId !== null) {
      this.createOrJoin(partyId);
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
