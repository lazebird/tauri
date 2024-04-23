<template>
  <div style="margin-right: 20px">
    <a-button class="btn" :icon="h(SettingOutlined)" href="#/setting" />
    <a-button class="btn" :icon="h(InfoCircleOutlined)" href="#/about" />
    <a-dropdown>
      <a-button class="btn" :icon="h(TranslationOutlined)" />
      <template #overlay>
        <a-menu v-model:selectedKeys="current" :items="items" @click="onClick" />
      </template>
    </a-dropdown>
  </div>
</template>
<script setup lang="ts">
import { h, ref } from "vue";
import { SettingOutlined, InfoCircleOutlined, TranslationOutlined } from "@ant-design/icons-vue";
import { computed } from "vue";
import { LocaleConf } from "#/tauri";
import { useLocaleStore } from "@/store/locale";
import { changeLocale } from "@/locales/setupI18n";

const localeStore = useLocaleStore();
const current = ref([localeStore.cur_lang]);
const items = computed(() => localeStore.localeList.map((l: LocaleConf) => ({ key: l.value, label: l.label, title: l.label })));

async function onClick({ key }: { key: string }) {
  await changeLocale(key);
  current.value = [localeStore.cur_lang];
  window.location.reload(); // force update vars in script
}
</script>
<style scoped>
.btn {
  margin-left: 8px;
}
</style>
