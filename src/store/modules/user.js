import { defineStore } from "pinia";

export const UserStore = defineStore("user", {
  state: () => ({
    token: "",
    info: {},
  }),
  actions: {
    setToken(token) {
      this.token = token;
    },
    setInfo(info) {
      this.info = info;
    }
  },
  getters: {
    getToken: (state) => state.token,
    getInfo: (state) => state.info
  },
  persist: {
    enabled: true,
  },
});