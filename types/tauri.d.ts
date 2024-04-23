export interface LocaleConf {
  label: string;
  value: string;
}
export interface AppConf {
  algorithm: String;
  borderRadius: number;
  colorPrimary: String;
  ifname?: string;
  stat_interval: number;
  data_dir?: string;
  protocol_dir?: string;
  localeList?: LocaleConf[];
  locale?: string;
}
