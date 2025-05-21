import { createApp } from "vue";

import App from "./App.vue";
import router from "./router";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import zhTw from "element-plus/dist/locale/zh-tw.mjs";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

import "./assets/main.css";

const app = createApp(App);

app.use(router);
app.use(ElementPlus, { locale: zhTw });
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.mount("#app");
