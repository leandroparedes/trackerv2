import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import axios from 'axios';
import VueAxios from 'vue-axios';
import vuetify from './plugins/vuetify';

Vue.use(VueAxios, axios);
Vue.use(require('vue-moment'));

Vue.config.productionTip = false;

Vue.filter('formatNumber', function (value) {
    return value ? Intl.NumberFormat().format(value) : 0;
});

new Vue({
    router,
    store,
    vuetify,
    render: function (h) { return h(App) }
}).$mount('#app');
