export default {
  namespaced: true,
  state: {
    headerForm: {}
  },
  mutations: {
    SET_FROM: (state, data) => {
      state.headerForm = data
    }
  },
  actions: {
    SetHeaderForm({ commit, state }, data) {
      commit('SET_FROM', data)
    }
  }
}
