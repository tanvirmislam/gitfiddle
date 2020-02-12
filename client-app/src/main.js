// ---------------------------------------------------------------------------------
// Imports
// ---------------------------------------------------------------------------------
// Vue
import Vue from 'vue';

// Fonts and Icons
import { FontAwesomeIcon } from './plugins/icons';

// Vuetify
import vuetify from './plugins/vuetify';

// Axios (HTTP Client)
import axios from 'axios';

// Router
import router from './router/index';
import { sync } from 'vuex-router-sync';

// Store (Vuex)
import store from './store';

// App root
import App from './components/app-root';

// ---------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------


// Initiate Vue
Vue.config.productionTip = false
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.prototype.$http = axios;

sync(store, router);

const app = new Vue({
    store,
    router,
    vuetify,
    ...App
});

app.$mount('#app');
