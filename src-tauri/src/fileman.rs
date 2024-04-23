use std::fs;

pub struct FileInfo {
    pub name: String,
    pub content: String,
    pub path: String,
}
impl FileInfo {
    pub fn read(dname: &str, fname: &str) -> Result<FileInfo, String> {
        let path = format!("{}/{}", dname, fname);
        match fs::read_to_string(&path) {
            Ok(s) => Ok(FileInfo { name: fname.to_owned(), content: s, path }),
            Err(e) => return Err(format!("read file {}/{} error: {}", dname, fname, e.to_string())),
        }
    }
    pub fn write(dname: &str, fname: &str, content: &str) -> Result<(), String> {
        match fs::write(format!("{}/{}", dname, fname), content) {
            Ok(_) => Ok(()),
            Err(e) => Err(format!("write file {}/{} error: {}", dname, fname, e.to_string())),
        }
    }

    pub fn read_dir(dname: &str) -> Result<Vec<FileInfo>, String> {
        let entries = match fs::read_dir(dname) {
            Ok(e) => e,
            Err(e) => return Err(format!("read dir {} error: {}", dname, e.to_string())),
        };
        let mut files = vec![];
        for entry in entries {
            let p = match entry {
                Ok(d) => d,
                Err(e) => return Err(format!("read dir {} error: {}", dname, e.to_string())),
            };
            if !p.file_type().unwrap().is_file() {
                continue;
            }
            // skip sub dirs
            let content = match fs::read_to_string(p.path()) {
                Ok(s) => s,
                Err(e) => return Err(format!("read entry {:?} error: {}", p, e.to_string())),
            };
            let name = p.file_name().to_str().unwrap().to_owned();
            let path = format!("{}/{}", dname, name);
            files.push(FileInfo { name, content, path })
        }
        Ok(files)
    }
}
