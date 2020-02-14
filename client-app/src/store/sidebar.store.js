// STATE
const state = {
    isSidebarVisible: true,
    sidebarWidth: 350
};


// GETTERS
const getters = {
    sidebarVisibilityStatus: state => state.isSidebarVisible,
    sidebarWidth: state => state.sidebarWidth
};

// MUTATIONS
const mutations = {
    toggleSidebar(state) {
        state.isSidebarVisible = !state.isSidebarVisible;
    }
};

// ACTIONS
const actions = {
    toggleSidebar(context) {
        context.commit('toggleSidebar');
    }
};

export default {
    state,
    getters,
    mutations,
    actions
};
