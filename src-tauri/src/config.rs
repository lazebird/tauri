use std::{
    env, fs,
    path::{Path, PathBuf},
};

use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct AppConf {
    pub ifname: Option<String>,
    pub selected_keys: Vec<usize>,
    datadir: String,
}
const CONFIG_FILE: &str = "xpkt.conf";

impl AppConf {
    fn _dump_env() {
        println!("current_dir {}", env::current_dir().unwrap().to_str().unwrap());
        println!("current_exe {}", env::current_exe().unwrap().to_str().unwrap());
        let it = env::vars();
        for (var, val) in it {
            println!("{} {}", var, val);
        }
    }
    pub fn get_datadir() -> String {
        if let Ok(dir) = env::var("APPIMAGE") {
            return Path::parent(&PathBuf::from(dir)).unwrap().to_str().unwrap().to_owned();
        }
        return env::current_dir().unwrap().to_str().unwrap().to_owned();
    }
    fn def(datadir: String) -> AppConf {
        AppConf { ifname: None, selected_keys: vec![], datadir }
    }
    pub fn save(&self) {
        let j = serde_json::to_string(self).unwrap();
        fs::write(format!("{}/{}", self.datadir, CONFIG_FILE), j).unwrap();
    }
    pub fn load() -> AppConf {
        let datadir = Self::get_datadir();
        if let Ok(j) = fs::read_to_string(format!("{}/{}", datadir, CONFIG_FILE)) {
            if let Ok(mut c) = serde_json::from_str::<AppConf>(&j) {
                c.datadir = datadir; // fix datadir if it is not correct
                return c;
            }
        }
        AppConf::def(datadir)
    }
}
