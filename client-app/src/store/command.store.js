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
    queueCommand(state, commandObj) {
        state.queue.push(commandObj);
    },

    addHistory(state, commandObj) {
        state.history.push(commandObj);
    },

    popHistory(state) {
        return state.history.pop();
    }
};

// ACTIONS
const actions = {
    queueCommand(context, commandObj) {
        context.commit('queueCommand', commandObj);
    },

    addHistory(context, commandObj) {
        context.commit('addHistory', commandObj);
    },

    popHistory(context) {
        return context.commit('pop');
    }
};

export default {
    state,
    getters,
    mutations,
    actions
};
