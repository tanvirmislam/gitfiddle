import Vue from 'vue'
import Vuex from 'vuex'
import CreatePersistedState from 'vuex-persistedstate'
import Sidebar from './sidebar.store'
import Sketch from './sketch.store'
import Command from './command.store'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    Sidebar,
    Command,
    Sketch
  },
  plugins: [
    CreatePersistedState({
      paths: ['Sidebar.isSidebarVisible']
    })
  ]
})

export default store