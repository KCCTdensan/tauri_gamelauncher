// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use tauri::Manager;
use window_shadows::set_shadow;
use serde_json::Value;
use std::fs::File;
use std::io::{Read};

#[tauri::command]
fn get_user_document_directory() -> Result<String, String>{
    if let Some(doc_dir) = dirs::document_dir() {
        let document_dir_path: String = doc_dir.to_string_lossy().into_owned();
        Ok(document_dir_path)
    }else {
        // let err_msg: String = "Missing Document Directory.";
        Ok("None".to_owned())
    }
}

#[tauri::command]
fn read_json_file(file_path: String) -> Result<Value, String> {
    // ファイルを開く
    let mut file: File = File::open(file_path).map_err(|err| err.to_string())?;
    // ファイルを文字列として読み込む
    let mut contents: String = String::new();
    file.read_to_string(&mut contents).map_err(|err| err.to_string())?;

    // JSON文字列をパースしてValueオブジェクトに変換
    let json: Value = serde_json::from_str(&contents).map_err(|err| err.to_string())?;

    Ok(json)

}

fn main() {
    tauri::Builder
        ::default()
        .invoke_handler(tauri::generate_handler![
            get_user_document_directory,
            read_json_file
            ])
        .setup(|app| {
            let main_window = app.get_window("main").unwrap();

            #[cfg(any(windows, target_os = "macos"))]
            set_shadow(main_window, true).unwrap();
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
