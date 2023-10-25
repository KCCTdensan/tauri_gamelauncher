// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use serde_json::Value;
use std::fs;
use std::fs::File;
// use std::io::prelude::*;
use std::io::BufReader;
use std::io::Read;
use std::io::Write;
use std::path::Path;
use tauri::Manager;
use window_shadows::set_shadow;
use zip::read::ZipArchive;

#[tauri::command]
fn get_user_document_directory() -> Result<String, String> {
    if let Some(doc_dir) = dirs::document_dir() {
        let document_dir_path: String = doc_dir.to_string_lossy().into_owned();
        Ok(document_dir_path)
    } else {
        // let err_msg: String = "Missing Document Directory.";
        Ok("None".to_owned())
    }
}

#[tauri::command]
fn upload_thumbnail_to_folder(file_path: String, dir_path: String) -> Result<String, String> {
    let file_extension: String = match std::path::Path::new(&file_path).extension() {
        Some(ext) => ext.to_string_lossy().to_lowercase(),
        None => {
            return Err("Invalid file path".to_string());
        }
    };

    let file_name = match std::path::Path::new(&file_path).file_name() {
        Some(file_name) => file_name.to_string_lossy().to_string(),
        None => {
            return Err("Invalid file path".to_string());
        }
    };

    // 画像の拡張子を許可する場合
    if file_extension == "jpg" || file_extension == "png" || file_extension == "gif" || file_extension == "webp" || file_extension == "svg" || file_extension == "bmp" || file_extension == "tiff" {
        // 画像のディレクトリパス
        let image_dir: String = dir_path;

        // 画像ディレクトリへファイルをコピー
        let new_file_path: String = format!("{}\\{}", image_dir, file_name);

        // ファイルをコピー
        if let Err(err) = std::fs::copy(&file_path, &new_file_path) {
            return Err(format!("Failed to copy file: {}\n{}", new_file_path, err));
        }

        return Ok(new_file_path);
    } else {
        return Err("Unsupported file type".to_string());
    }

    // Ok("None".to_owned())
}

#[tauri::command]
fn upload_main_directory(file_path: String, dir_path: String) -> Result<String, String> {
    let file: File = File::open(file_path).map_err(|err| err.to_string())?;
    let reader: BufReader<File> = BufReader::new(file);
    let mut archive: ZipArchive<BufReader<File>> =
        ZipArchive::new(reader).map_err(|err| err.to_string())?;

    for i in 0..archive.len() {
        let mut file = archive.by_index(i).map_err(|err| err.to_string())?;
        let file_name = file.name();
        let extraction_path = Path::new(&dir_path).join(file_name);

        if file.is_dir() {
            // Create the directory in the extraction path
            fs::create_dir_all(&extraction_path).map_err(|err| err.to_string())?;
        } else {
            // Create the parent directory if it doesn't exist
            if let Some(parent_dir) = extraction_path.parent() {
                fs::create_dir_all(parent_dir).map_err(|err| err.to_string())?;
            }

            let mut extracted_file =
                File::create(&extraction_path).map_err(|err| err.to_string())?;
            let _ = std::io::copy(&mut file, &mut extracted_file);
        }
    }

    Ok("None".to_owned())
}

#[tauri::command]
fn read_json_file(file_path: String) -> Result<Value, String> {
    // ファイルを開く
    let mut file: File = File::open(file_path).map_err(|err| err.to_string())?;
    // ファイルを文字列として読み込む
    let mut contents: String = String::new();
    file.read_to_string(&mut contents)
        .map_err(|err| err.to_string())?;

    // JSON文字列をパースしてValueオブジェクトに変換
    let json: Value = serde_json::from_str(&contents).map_err(|err| err.to_string())?;

    Ok(json)
}

#[tauri::command]
fn save_json_file(file_path: String, data: Value) -> Result<(), String> {
    let json_string: String = serde_json::to_string_pretty(&data).map_err(|err| err.to_string())?;

    let mut file = std::fs::OpenOptions::new()
        .create(true)
        .write(true)
        .truncate(true)
        .open(&file_path)
        .map_err(|err| err.to_string())?;

    file.write_all(json_string.as_bytes())
        .map_err(|err| err.to_string())?;

    Ok(())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_user_document_directory,
            read_json_file,
            save_json_file,
            upload_main_directory,
            upload_thumbnail_to_folder
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
