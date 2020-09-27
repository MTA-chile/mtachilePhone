import Vue from 'vue'
import VueRouter from 'vue-router'

import VueMaterial from 'vue-material'

import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css';

import routes from './routes';
import axios from 'axios'


import '@mdi/font/css/materialdesignicons.css';

import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';

Vue.use(Vuetify);

Vue.use({
  install (Vue) {
  Vue.prototype.$api = axios.create({
    baseURL: 'https://roleplaymta.herokuapp.com'
  })
}
})


const router = new VueRouter({routes});

Vue.use(VueRouter)
Vue.use(VueMaterial)


Vue.config.productionTip = false

new Vue({
  router,
  template: `
    <div>
      <router-view class="view"></router-view>
    </div>
  `,
  vuetify: new Vuetify({
		icons: {
			iconfont: 'mdi' // default - only for display purposes
		}
	}),
}).$mount('#app');