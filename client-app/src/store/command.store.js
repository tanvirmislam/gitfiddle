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
    add(state, cmd) {
        state.queue.push(cmd);
        state.history.push(cmd);
    },

    pop(state) {
        return state.history.pop();
    },

    isBeingProcessed(state, commandStr) {
        let commandObj = null;

        for (let i = 0; i < state.history.length; ++i) {
            if (history[i].command === commandStr) {
                commandObj = history[i];
                break;
            }
        }

        if (commandObj !== null) {
            return (commandObj.hasExecuted === false && state.queue.includes(commandObj));
        }
        else {
            return false;
        }
    },

    hasBeenProcessed(state, commandStr) {
        let commandObj = null;

        for (let i = 0; i < state.history.length; ++i) {
            if (history[i].command === commandStr) {
                commandObj = history[i];
                break;
            }
        }

        if (commandObj !== null) {
            return (commandObj.hasExecuted === true && !state.queue.includes(commandObj));
        }
        else {
            return false;
        }
    }
};

// ACTIONS
const actions = {
    add(context, cmd) {
        context.commit('add', cmd);
    },

    pop(context) {
        return context.commit('pop');
    },

    isBeingProcessed(context, commandStr) {
        return context.commit('isBeingProcessed', commandStr);
    },

    hasBeenProcessed(context, commandStr) {
        return context.commit('hasBeenProcessed', commandStr);
    }
};

export default {
    state,
    getters,
    mutations,
    actions
};
