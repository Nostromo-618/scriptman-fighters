import { createApp } from "vue";
import { VanduoVue } from "@vanduo-oss/vd3";
import "@vanduo-oss/vd3/css";
import "@vanduo-oss/vd3-cbun/code-editor/css";
import { installStoragePrefix } from "./utils/storagePrefix";
import App from "./App.vue";
import "./styles/main.css";

installStoragePrefix();

const app = createApp(App);

app.use(VanduoVue, {
  themeDefaults: {
    PALETTE: "open-color",
    PRIMARY_LIGHT: "green",
    PRIMARY_DARK: "green",
    NEUTRAL: "slate",
    RADIUS: "0.5",
    FONT: "ubuntu",
  },
});

app.mount("#app");
