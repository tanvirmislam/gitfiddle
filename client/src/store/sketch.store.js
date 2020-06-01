import Tree from '../utils/tree/tree'
import TreeFormatter from '../utils/tree/tree-formatter'

// STATE
const state = {
  tree: new Tree(new TreeFormatter()),
  hasSimulationStarted: false,
  isTreeBeingCreatedFromGit: false
}

// GETTERS
const getters = {
  tree: state => state.tree,
  root: state => state.tree.root,
  nodeSet: state => state.tree.nodeSet,
  branchNameToNodeDict: state => state.tree.branchNameToNodeDict,
  treeInfo: state => state.tree.info,
  treeFormatter: state => state.tree.formatter,
  animationSpeed: state => state.tree.animationSpeed,
  hasSimulationStarted: state => state.hasSimulationStarted,
  isTreeBeingCreatedFromGit: state => state.isTreeBeingCreatedFromGit
}

// MUTATIONS
const mutations = {
  addNodeTo (state, parentName, node) {
    state.tree.addNodeTo(parentName, node)
  },

  setFormatterCanvasWidth (state, width) {
    state.tree.formatter.canvasWidth = width
  },

  setFormatterCanvasHeight (state, height) {
    state.tree.formatter.canvasHeight = height
  },

  setAnimationSpeed (state, spd) {
    state.animationSpeed = spd
  },

  startSimulation (state) {
    state.hasSimulationStarted = true
    state.tree.reset()
  },

  beginTreeCreationFromGit (state) {
    state.isTreeBeingCreatedFromGit = true
  },

  endTreeCreationFromGit (state) {
    state.isTreeBeingCreatedFromGit = false
  }
}

// ACTIONS
const actions = {
  addNodeTo (context, parentName, node) {
    context.commit('addNodeTo', parentName, node)
  },

  setFormatterCanvasWidth (context, width) {
    context.commit('setFormatterCanvasWidth', width)
  },

  setFormatterCanvasHeight (context, height) {
    context.commit('setFormatterCanvasHeight', height)
  },

  setAnimationSpeed (context, spd) {
    context.commit('setAnimationSpeed', spd)
  },

  startSimulation (context) {
    context.commit('startSimulation')
  },

  beginTreeCreationFromGit (context) {
    context.commit('beginTreeCreationFromGit')
  },

  endTreeCreationFromGit (context) {
    context.commit('endTreeCreationFromGit')
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
