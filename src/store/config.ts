import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { store } from "./index";
import { AppConf, LocaleConf } from "#/tauri";

const locale_key = "tauri_conf_lang";
const defLocaleList: LocaleConf[] = [
  { label: "Auto", value: "" },
  { label: "中文", value: "zh_CN" },
  { label: "English", value: "en_US" },
];
const initConf: AppConf = { algorithm: "Default", borderRadius: 6, colorPrimary: "#1677ff", stat_interval: 3, localeList: defLocaleList };

export const useConfigStore = defineStore("config", () => {
  const conf = ref();
  async function init() {
    conf.value = JSON.parse(JSON.stringify(initConf));
    const locale = localStorage.getItem(locale_key);
    if (locale) conf.value.locale = locale;
  }
  async function update(c: AppConf) {
    conf.value = c;
    if (conf.value.locale?.length) localStorage.setItem(locale_key, conf.value.locale);
    else localStorage.removeItem(locale_key);
  }
  return { conf, init, update };
});

export const useConfigStoreOut = () => useConfigStore(store);
