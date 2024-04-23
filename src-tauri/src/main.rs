// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

pub mod config;
pub mod filedata;
pub mod fileman;
use config::AppConf;
use filedata::FileData;
use fileman::FileInfo;

#[tauri::command]
fn get_datadir() -> Result<String, String> {
    Ok(AppConf::get_datadir())
}

#[tauri::command]
fn read_file(mut dname: String, fname: String) -> Result<String, String> {
    if dname == "" {
        dname = AppConf::get_datadir();
    }
    match FileInfo::read(&dname, &fname) {
        Ok(i) => Ok(i.content),
        Err(e) => Err(e),
    }
}

#[tauri::command]
fn write_file(mut dname: String, fname: String, content: String) -> Result<(), String> {
    if dname == "" {
        dname = AppConf::get_datadir();
    }
    FileInfo::write(&dname, &fname, &content)
}

#[tauri::command]
fn read_dir(mut dname: String) -> Result<Vec<FileData>, String> {
    if dname == "" {
        dname = AppConf::get_datadir();
    }
    match FileInfo::read_dir(&dname) {
        Ok(v) => Ok(v
            .into_iter()
            .filter(|e| e.name.ends_with(".js"))
            .map(|e| FileData {
                name: e.name,
                path: e.path,
                content: e.content,
            })
            .collect()),
        Err(e) => Err(e),
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_datadir, read_file, write_file, read_dir])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
