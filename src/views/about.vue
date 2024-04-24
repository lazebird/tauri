<template>
  <h1>{{ t("app.about.info") }}</h1>
  <a-descriptions bordered>
    <a-descriptions-item v-for="(d, index) in data" :key="index" :label="d.label">
      <a v-if="d.link" :href="d.link" target="_blank">{{ d.value }}</a>
      <template v-else>{{ d.value }}</template>
    </a-descriptions-item>
  </a-descriptions>

  <h1>{{ t("app.about.dep") }}</h1>
  <a-descriptions bordered>
    <a-descriptions-item v-for="key in Object.keys(dependencies)" :key="key" :label="key">{{ (dependencies as any)[key] }}</a-descriptions-item>
  </a-descriptions>

  <h1>{{ t("app.about.devDep") }}</h1>
  <a-descriptions bordered>
    <a-descriptions-item v-for="key in Object.keys(devDependencies)" :key="key" :label="key">{{ (devDependencies as any)[key] }}</a-descriptions-item>
  </a-descriptions>
</template>
<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const { pkg, git, buildTime } = __APP_INFO__; /*global __APP_INFO__*/

const { name, version, homepage, issuepage, releasepage, dependencies, devDependencies } = pkg;
document.title = name;
const data = [
  { label: t("app.about.name"), value: name, link: homepage },
  { label: t("app.about.version"), value: `${version} (${git.branch} ${git.hash} ${git.date})`, link: releasepage },
  { label: t("app.about.buildTime"), value: buildTime },
  { label: t("app.about.issue"), value: "Github", link: issuepage },
];
</script>
