import { type App } from 'vue';
import type { I18nOptions } from 'vue-i18n';
import { createI18n } from 'vue-i18n';
import { useLocaleStore } from '@/store/locale';

export let i18n: ReturnType<typeof createI18n>;

async function createI18nOptions(): Promise<I18nOptions> {
  const messages: any = {};
  const localeStore = useLocaleStore();
  const { locale, message } = await localeStore.init();
  messages[locale] = message;
  if (locale !== localeStore.fallback) messages[localeStore.fallback] = await localeStore.load(localeStore.fallback);

  return {
    legacy: false,
    locale,
    fallbackLocale: localeStore.fallback,
    messages,
    availableLocales: [],
    sync: true, //If you don’t want to inherit locale from global scope, you need to set sync of i18n component option to false.
    silentTranslationWarn: true, // true - warning off
    missingWarn: false,
    silentFallbackWarn: true,
  };
}

export async function changeLocale(newlang: string) {
  const localeStore = useLocaleStore();
  const globalI18n = i18n.global;
  if (localeStore.conf_lang === newlang) return newlang;
  const { conf_lang, cur_lang } = localeStore;
  const { locale, message } = await localeStore.update(newlang);
  if (!Object.keys(globalI18n.getLocaleMessage(locale)).length) {
    globalI18n.mergeLocaleMessage(locale, message);
    console.log('locale %s message merged: %o', locale, message);
  } else {
    console.log('locale %s message exists: %o', locale, globalI18n.getLocaleMessage(locale));
  }
  if (i18n.mode === 'legacy') {
    i18n.global.locale = locale;
  } else {
    (i18n.global.locale as any).value = locale;
  }
  // moment.locale(locale);
  console.log('change locale %s(conf.%s) -> %s(conf.%s)', cur_lang, conf_lang, locale, newlang);
}

// setup i18n instance with glob
export async function setupI18n(app: App) {
  const options = await createI18nOptions();
  i18n = createI18n(options);
  app.use(i18n);
}

export const t = (key: string) => key; // for route i18n ally only
