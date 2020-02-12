// STATE
const state = {
    isSidebarVisible: true
};


// GETTERS
const getters = {
    sidebarVisibilityStatus: state => state.isSidebarVisible
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
