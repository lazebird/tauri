import { RouteRecordRaw, createRouter, createWebHashHistory } from "vue-router";
import aboutVue from "@/views/about.vue";
import settingVue from "@/views/setting.vue";
import { App } from "vue";
import { t } from "@/locales/setupI18n";

export const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Root",
    redirect: "/about",
  },
  {
    path: "/about",
    name: t("app.route.about"),
    component: aboutVue,
    meta: { hide: true },
  },
  {
    path: "/setting",
    name: t("app.route.setting"),
    component: settingVue,
    meta: { hide: true },
  },
];
const defRouterOpts = { history: createWebHashHistory(), strict: true, scrollBehavior: () => ({ left: 0, top: 0 }) };
const router = createRouter({ ...defRouterOpts, routes });

export function setupRouter(app: App<Element>) {
  app.use(router);
}
