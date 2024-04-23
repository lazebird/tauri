import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { store } from './index';
import { AppConf, LocaleConf } from '#/tauri';
import { tauri_on } from '@/api/share';
import { invoke } from '@tauri-apps/api';
import { theme } from 'ant-design-vue';

const appCfgFile = 'xpkt.cfg';
const defLocaleList: LocaleConf[] = [
  { label: 'Auto', value: '' },
  { label: '中文', value: 'zh_CN' },
  { label: 'English', value: 'en_US' },
];
const initConf: AppConf = { algorithm: 'Default', borderRadius: 6, colorPrimary: '#1677ff', stat_interval: 3, localeList: defLocaleList };
const algMap = [
  { label: 'Default', value: theme.defaultAlgorithm },
  { label: 'Dark', value: theme.darkAlgorithm },
  { label: 'Compact', value: theme.compactAlgorithm },
];

const path_join = (a: string, b: string) => (navigator.userAgent.includes('Windows') ? `${a}\\${b}` : `${a}/${b}`);
export const useConfigStore = defineStore('config', () => {
  const conf = ref();
  async function init() {
    let cfg: AppConf = initConf;
    if (tauri_on()) {
      try {
        cfg = { ...cfg, ...JSON.parse(await invoke('read_file', { dname: '', fname: appCfgFile })) }; // merge to avoid member missing
        for (const l of initConf.localeList ?? []) if (!cfg.localeList?.find((e) => e.value === l.value)) cfg.localeList?.push(l); // keep localeList updated here
      } catch (e) {
        console.log('read %s error: %o, use default config', appCfgFile, e);
      }
      cfg.data_dir = await invoke('get_datadir');
      if (!cfg.protocol_dir && cfg.data_dir) cfg.protocol_dir = path_join(cfg.data_dir, 'protocol');
    }

    conf.value = cfg;
  }
  async function update(c: AppConf) {
    conf.value = c;
    if (tauri_on()) await invoke('write_file', { dname: '', fname: appCfgFile, content: JSON.stringify(c) });
  }
  const algOpts = algMap.map((e) => ({ label: e.label, value: e.label })); // use name string for config saving
  const algorithm = computed(() => algMap.find((e) => e.label === conf.value.algorithm)?.value);

  return { conf, init, update, algOpts, algorithm };
});

export const useConfigStoreOut = () => useConfigStore(store);
