import type { App } from "vue";
import { createPinia } from "pinia";
import { useConfigStoreOut } from "./config";
import { useLocaleStoreOut } from "./locale";

export const store = createPinia();
export async function setupStore(app: App<Element>) {
  app.use(store);
  await useConfigStoreOut().init();
  await useLocaleStoreOut().init();
}
