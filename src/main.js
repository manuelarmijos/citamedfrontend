import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import VueCryptojs from 'vue-cryptojs'
import BlockUI from 'vue-blockui'
import VueSession from 'vue-session'
import Vuesax from 'vuesax'
import 'vuesax/dist/vuesax.css' //Vuesax styles
import JsonExcel from "vue-json-excel";
import moment from 'moment'

Vue.prototype.moment = moment

Vue.component("downloadExcel", JsonExcel);
Vue.prototype.$EventBus = new Vue()
Vue.use(Vuesax, {
  // options here
})

var VueCookie = require('vue-cookie');
// Tell Vue to use the plugin
Vue.use(VueCookie);

Vue.use(VueSession)

Vue.use(BlockUI)

Vue.use(VueCryptojs)

Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)
Vue.use(VueAxios, axios)


import VueJWT from 'vuejs-jwt'

Vue.use(VueJWT)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
