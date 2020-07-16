import Vue from "vue";
import VueRouter from "vue-router";
import Vuetify from "vuetify";
import App from "./App.vue";
import { router } from "./router";
import "vuetify/dist/vuetify.min.css";

Vue.use(VueRouter);
Vue.use(Vuetify);
const vuetify = new Vuetify();

new Vue({
  vuetify,
  router,
  render: (h) => h(App),
}).$mount("#root");
