<template>
  <div>
    <br />
    <a-form ref="setForm" :model="conf" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" style="text-align: left">
      <a-form-item :label="t('app.setting.algorithm')" name="algorithm" required><a-radio-group v-model:value="conf.algorithm" :options="configStore.algOpts" optionType="button" button-style="solid" /> </a-form-item>
      <a-form-item :label="t('app.setting.colorPrimary')" name="colorPrimary" required> <input type="color" :value="conf.colorPrimary" @input="(e) => (conf.colorPrimary = (e.target as HTMLInputElement).value)" /></a-form-item>
      <a-form-item :label="t('app.setting.borderRadius')" name="borderRadius" required> <a-input-number v-model:value="conf.borderRadius" /> </a-form-item>
      <a-form-item :label="t('app.setting.statInterval')" name="stat_interval" required> <a-input-number v-model:value="conf.stat_interval" /> </a-form-item>
      <a-form-item :label="t('app.setting.datadir')">
        <a @click="open(conf.data_dir)">{{ conf.data_dir }} </a>
      </a-form-item>
      <a-form-item :label="t('app.setting.protodir')" name="protocol_dir">
        <a @click="onDbclick">{{ conf.protocol_dir }}</a>
      </a-form-item>
    </a-form>
    <div>
      <a-button class="btn" type="primary" :icon="h(SaveOutlined)" @click="onSave">{{ t("app.setting.save") }}</a-button>
      <a-button class="btn" :icon="h(UndoOutlined)" @click="onReset">{{ t("app.setting.reset") }}</a-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, h } from "vue";
import { UndoOutlined, SaveOutlined } from "@ant-design/icons-vue";
import { useConfigStore } from "@/store/config";
import { open } from "@tauri-apps/api/shell";
import { open as dopen } from "@tauri-apps/api/dialog";
import { theme } from "ant-design-vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const configStore = useConfigStore();
const { token } = theme.useToken();

const setForm = ref();
const conf = ref({ ...configStore.conf });
const onSave = () => configStore.update({ ...configStore.conf, ...conf.value });
const onReset = () => (conf.value = { ...configStore.conf });
async function onDbclick() {
  const selected = await dopen({ directory: true, defaultPath: conf.value.protocol_dir });
  if (!selected) return;
  conf.value.protocol_dir = selected;
}
</script>
<style scoped>
.btn {
  margin-left: 8px;
}
input[type="color"] {
  border: 1px solid v-bind("token.colorBorder");
  background-color: v-bind("token.colorBgBase");
}
</style>
