import { ref } from "vue";
import { defineStore } from "pinia";
import { store } from "./index";
import { invoke } from "@tauri-apps/api";
import { useConfigStoreOut } from "./config";
import { LocaleConf } from "#/tauri";
// import { message as alert } from "ant-design-vue";

function navlang2locale(navlang: string) {
  const map: any = {};
  map["zh"] = "zh_CN";
  map["en"] = "en_US";
  return map[navlang] || navlang.replace("-", "_");
}
async function getLocaleAsync(localeList: LocaleConf[], fallback: string) {
  let navlocale = navlang2locale(navigator.language);
  console.log("navlocale %s, localeList %s", navlocale, JSON.stringify(localeList.map((l) => l.value)));
  if (!localeList?.find((l: any) => l.value === navlocale)) navlocale = fallback;
  return navlocale;
}

export const useLocaleStore = defineStore("locale", () => {
  const configStore = useConfigStoreOut();
  const fallback = "zh_CN";
  const localeList = ref([] as LocaleConf[]);
  const conf_lang = ref("");
  const cur_lang = ref("");
  const messages = ref({} as any);
  async function load(locale: string) {
    if (!messages.value[locale]) {
      let message: any = {};
      let count = 0;
      try {
        message = JSON.parse(await invoke("read_file", { dname: "", fname: `${locale}.json` }));
      } catch (e: any) {
        console.warn("load customize %s.json error: %s", locale, e.toLocaleString());
        message = undefined;
        console.log("test ", ++count);
      }
      try {
        console.log("test ", ++count);
        if (!message) message = await import(`../../langs/${locale}.json`);
        console.log("test ", ++count);
        const antdLocale: any = await import(`../../node_modules/ant-design-vue/es/locale/${locale}.js`);
        // const antdLocale: any = undefined; // use this line instead of the line above, to fix blank screen issue in chinese env
        console.log("test ", ++count);
        messages.value[locale] = { ...message, antdLocale: antdLocale?.default };
        console.log("update locale %s, message %o", locale, messages.value[locale]);
      } catch (e: any) {
        // alert.error(`load internal ${locale}.json error: ${e}`, 5);
        console.log("test ", ++count);
        console.error("load internal locale %s error: %s", locale, e.toLocaleString());
        messages.value[locale] = {};
      }
    }
    return messages.value[locale];
  }
  async function init() {
    if (cur_lang.value?.length) return { locale: cur_lang.value, message: await load(cur_lang.value) };

    await configStore.init();
    localeList.value = configStore.conf.localeList ?? [];
    conf_lang.value = configStore.conf.locale;
    cur_lang.value = conf_lang.value?.length ? conf_lang.value : await getLocaleAsync(localeList.value, fallback);
    console.log("conf lang %s, cur lang %s", conf_lang.value, cur_lang.value);
    await load(fallback);
    return { locale: cur_lang.value, message: await load(cur_lang.value) };
  }
  async function update(newlocale: string) {
    conf_lang.value = newlocale;
    configStore.update({ ...configStore.conf, locale: conf_lang.value });
    cur_lang.value = newlocale.length ? newlocale : await getLocaleAsync(localeList.value, fallback);
    return { locale: cur_lang.value, message: await load(cur_lang.value) };
  }

  return { fallback, localeList, conf_lang, cur_lang, init, load, update };
});

export const useLocaleStoreOut = () => useLocaleStore(store);
