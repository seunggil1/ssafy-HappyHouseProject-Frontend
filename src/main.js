import Vue from 'vue';
import App from './App.vue';
import { BootstrapVue, IconsPlugin, BootstrapVueIcons } from 'bootstrap-vue';
import VueMaterial from 'vue-material';
import router from './router';
import store from './store';
import SoftUIDashboard from "./soft-ui-dashboard";
import VCalendar from 'v-calendar';

import "./assets/css/nucleo-icons.css";
import "./assets/css/nucleo-svg.css";

import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default.css';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons)
Vue.use(IconsPlugin);
Vue.use(VueMaterial);
Vue.use(SoftUIDashboard);
Vue.use(VCalendar);
Vue.config.productionTip = false;

new Vue({
	router,
	store,
	render: (h) => h(App)
}).$mount('#app');
