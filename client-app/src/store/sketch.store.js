import Tree from './modules/tree';

// STATE
const state = {
    tree: new Tree()
};


// GETTERS
const getters = {
    tree: state => state.tree,
    root: state => state.tree.root,
    nodeDict: state => state.tree.nodeDict,
    node(name) {
        return state => state.tree.nodeDict[name];    
    }
};

// MUTATIONS
const mutations = {
    addNodeTo(state, parentName, node) {
        state.tree.addNodeTo(parentName, node);
    }
};

// ACTIONS
const actions = {
    addNodeTo(context, parentName, node) {
        context.commit('addCircle', parentName, node);
    }
};

export default {
    state,
    getters,
    mutations,
    actions
};
