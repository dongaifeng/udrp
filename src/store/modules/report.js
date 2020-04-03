const report = {
  namespaced: true,
  state: {
    ProjectId: '',
    DataTableId: '',
    ServiceId: '',
    Definition: {}
  },
  mutations: {
    SET_PROJECTID: (state, ProjectId) => {
      state.ProjectId = ProjectId
    },
    SET_DATATABLEID: (state, DataTableId) => {
      state.DataTableId = DataTableId
    },
    SET_DEFINITION: (state, data) => {
      state.Definition = data
    },
    SET_SERVICEID: (state, ServiceId) => {
      state.ServiceId = ServiceId
    }
  },
  actions: {

    async SetProjectId({ commit, state }, ProjectId) {
      commit('SET_PROJECTID', ProjectId)
    },
    async SetServiceId({ commit, state }, ServiceId) {
      commit('SET_SERVICEID', ServiceId)
    },
    async SetDataTableId({ commit, state }, DataTableId) {
      commit('SET_DATATABLEID', DataTableId)
    },
    async SetDefinition({ commit, state }, Definition) {
      commit('SET_DEFINITION', Definition)
    }
  }
}

export default report
