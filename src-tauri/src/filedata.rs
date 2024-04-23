use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub struct FileData {
    pub name: String,
    pub content: String,
    pub path: String,
}
