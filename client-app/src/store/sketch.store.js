import TreeFormatter from './git-tree-modules/tree-formatter';
import Tree from './git-tree-modules/tree';


// STATE
const state = {
    tree: new Tree(new TreeFormatter()),
    hasStarted: false
};

// GETTERS
const getters = {
    tree: state => state.tree,
    root: state => state.tree.root,
    nodeSet: state => state.tree.nodeSet,
    branchNameToNodeDict: state => state.tree.branchNameToNodeDict,
    treeInfo: state => state.tree.info,
    treeFormatter: state => state.tree.formatter,
    animationSpeed: state => state.tree.animationSpeed,
    hasStarted: state => state.hasStarted
};

// MUTATIONS
const mutations = {
    addNodeTo(state, parentName, node) {
        state.tree.addNodeTo(parentName, node);
    },

    setFormatterCanvasWidth(state, width) {
        state.tree.formatter.canvasWidth = width;
    },

    setFormatterCanvasHeight(state, height) {
        state.tree.formatter.canvasHeight = height;
    },

    setAnimationSpeed(state, spd) {
        state.animationSpeed = spd;
    },

    start(state) {
        state.hasStarted = true;
    }
};

// ACTIONS
const actions = {
    addNodeTo(context, parentName, node) {
        context.commit('addNodeTo', parentName, node);
    },

    setFormatterCanvasWidth(context, width) {
        context.commit('setFormatterCanvasWidth', width);
    },

    setFormatterCanvasHeight(context, height) {
        context.commit('setFormatterCanvasHeight', height);
    },

    setAnimationSpeed(context, spd) {
        context.commit('setAnimationSpeed', spd);
    },

    start(context) {
        context.commit('start');
    }
};

export default {
    state,
    getters,
    mutations,
    actions
};
