<template>
  <a-config-provider :theme="{ algorithm: configStore.algorithm, token: { colorPrimary: configStore.conf.colorPrimary, borderRadius: `${configStore.conf.borderRadius}px` } }">
    <a-layout style="height: 100%">
      <a-layout-header class="header" style="padding: 0">
        <a-row>
          <a-col :span="16">
            <a-menu class="menu" v-model:selectedKeys="current" mode="horizontal" theme="dark">
              <a-menu-item v-for="e in routes.filter((r) => !r.redirect && !r.meta?.hide)" :key="e.path">
                <template #icon v-if="e.meta?.icon"><img class="icon" :src="e.meta.icon as string" /></template>
                <template #icon v-else-if="e.meta?.icon_com"><component :is="e.meta.icon_com" /></template>
                <RouterLink :to="e.path || 'unknown'">{{ t(e.name as string) }}</RouterLink>
              </a-menu-item>
            </a-menu>
          </a-col>
          <a-col :span="8" class="action"> <actionVue /> </a-col>
        </a-row>
      </a-layout-header>
      <a-layout-content style="height: 100%"> <RouterView /> </a-layout-content>
    </a-layout>
  </a-config-provider>
</template>
<script lang="ts" setup>
import { ref, watchEffect } from "vue";
import { useRouter } from "vue-router";
import { routes } from "../router";
import actionVue from "@/views/action.vue";
import { useConfigStore } from "@/store/config";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const configStore = useConfigStore();
const router = useRouter();
const current = ref([""]);
watchEffect(() => (current.value = [router.currentRoute.value.path]));
</script>
<style scoped>
.menu {
  background-color: inherit;
  color: white;
}
.icon {
  height: 24px;
  color: white;
}
.netif {
  display: list-item;
}
.action {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}
</style>
