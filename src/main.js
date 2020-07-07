import Vue from 'vue'
import App from './App.vue'
import router from './router'

// export FAUNADB_SERVER_SECRET = fnADwAb8WMACBdmk7a - pZlu3uheEn7p5hfQZn93h

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
