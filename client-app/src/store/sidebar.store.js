// STATE
const state = {
  isSidebarVisible: true,
  sidebarWidth: 380
}

// GETTERS
const getters = {
  sidebarVisibilityStatus: state => state.isSidebarVisible,
  sidebarWidth: state => state.sidebarWidth
}

// MUTATIONS
const mutations = {
  toggleSidebar (state) {
    console.log('toggling sidebar')
    state.isSidebarVisible = !state.isSidebarVisible
  }
}

// ACTIONS
const actions = {
  toggleSidebar (context) {
    context.commit('toggleSidebar')
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
