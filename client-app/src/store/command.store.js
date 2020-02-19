// STATE
const state = {
    queue: [],
    history: []
};


// GETTERS
const getters = {
    queue: state => state.queue,
    history: state => state.history
};

// MUTATIONS
const mutations = {
    add(state, commandObj) {
        state.queue.push(commandObj);
        state.history.push(commandObj);
    }
};

// ACTIONS
const actions = {
    add(context, commandObj) {
        context.commit('add', commandObj);
    }
};

export default {
    state,
    getters,
    mutations,
    actions
};
