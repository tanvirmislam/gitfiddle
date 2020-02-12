import Vue from 'vue';
import Vuex from 'vuex';
import CreatePersistedState from 'vuex-persistedstate';
import Sidebar from './sidebar.store';
import Command from './command.store';
import Sketch from './sketch.store';

Vue.use(Vuex);

export default new Vuex.Store({
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
});
