import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { store } from "./index";
import { AppConf, LocaleConf } from "#/tauri";
import { theme } from "ant-design-vue";

const locale_key = "tauri_conf_lang";
const defLocaleList: LocaleConf[] = [
  { label: "Auto", value: "" },
  { label: "中文", value: "zh_CN" },
  { label: "English", value: "en_US" },
];
const initConf: AppConf = { algorithm: "Default", borderRadius: 6, colorPrimary: "#1677ff", stat_interval: 3, localeList: defLocaleList };
const algMap = [
  { label: "Default", value: theme.defaultAlgorithm },
  { label: "Dark", value: theme.darkAlgorithm },
  { label: "Compact", value: theme.compactAlgorithm },
];

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
  const algOpts = algMap.map((e) => ({ label: e.label, value: e.label })); // use name string for config saving
  const algorithm = computed(() => algMap.find((e) => e.label === conf.value.algorithm)?.value);

  return { conf, init, update, algOpts, algorithm };
});

export const useConfigStoreOut = () => useConfigStore(store);
