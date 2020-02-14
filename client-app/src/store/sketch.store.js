import TreeFormatter from './tree-modules/tree-formatter';
import Tree from './tree-modules/tree';


// STATE
const state = {
    tree: new Tree(new TreeFormatter())
};

// GETTERS
const getters = {
    tree: state => state.tree,
    root: state => state.tree.root,
    treeInfo: state => state.tree.info,
    treeFormatter: state => state.tree.formatter,
    nameToNodeDict: state => state.tree.nameToNodeDict
};

// MUTATIONS
const mutations = {
    addNodeTo(state, parentName, node) {
        state.tree.addNodeTo(parentName, node);
    },

    setCanvasWidth(state, width) {
        state.tree.formatter.canvasWidth = width;
    },

    setCanvasHeight(state, height) {
        state.tree.formatter.canvasHeight = height;
    }
};

// ACTIONS
const actions = {
    addNodeTo(context, parentName, node) {
        context.commit('addNodeTo', parentName, node);
    },

    setCanvasWidth(context, width) {
        context.commit('setCanvasWidth', width);
    },

    setCanvasHeight(context, height) {
        context.commit('setCanvasHeight', height);
    }
};

export default {
    state,
    getters,
    mutations,
    actions
};
