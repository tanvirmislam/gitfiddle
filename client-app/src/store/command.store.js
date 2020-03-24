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
    },

    flushQueue(state) {
        state.queue = [];
    },

    flushHistory(state) {
        state.history = [];
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
    },

    flushQueue(context) {
        context.commit('flushQueue');
    },

    flushHistory(context) {
        context.commit('flushHistory');
    }
};

export default {
    state,
    getters,
    mutations,
    actions
};
