// STATE
const state = {
    command: '',
    history: new Array()
};


// GETTERS
const getters = {
    command: state => state.command,
    history: state => state.history
};

// MUTATIONS
const mutations = {
    setCommand(state, val) {
        state.command = val;
        state.history.push(val);
    }
};

// ACTIONS
const actions = {
    setCommand(context, val) {
        context.commit('setCommand', val);
    }
};

export default {
    state,
    getters,
    mutations,
    actions
};
