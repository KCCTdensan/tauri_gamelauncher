// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::fs;
use std::fs::File;
use std::io::BufReader;
use std::io::Read;
use std::io::{self, Write};
use std::path::Path;
use tauri::Manager;
use walkdir::WalkDir;
use window_shadows::set_shadow;
use zip::read::ZipArchive;
use zip::ZipWriter;

#[derive(Serialize, Deserialize)]
struct Tag {
    name: String,
}
#[derive(Serialize, Deserialize)]
struct MyData {
    author: String,
    description: String,
    guid: String,
    name: String,
    pics: Vec<String>,
    tags: Vec<Tag>,
    target_file: String,
    thumbnail: String,
    url: String,
}

#[tauri::command]
fn initialize_json(dir_path: &str, file_name: &str) -> Result<(), String> {
    let directory_path = dir_path;
    let file_name = file_name;
    let file_path = format!("{}/{}", directory_path, file_name);

    // ディレクトリが存在しない場合、再帰的に作成
    if !fs::metadata(directory_path).is_ok() {
        fs::create_dir_all(directory_path).expect("Failed to create directory");
    }

    if !fs::metadata(&file_path).is_ok() {
        let data = vec![MyData {
            author: "d3bu".to_string(),
            description: "作品説明".to_string(),
            guid: "00000000-0000-0000-0000-000000000000".to_string(),
            name: "作品名".to_string(),
            pics: Vec::new(),
            tags: Vec::new(),
            target_file: "".to_string(),
            thumbnail: "".to_string(),
            url: "https://d3bu.net".to_string(),
        }];

        // データをJSONにシリアライズ
        let data_json =
            serde_json::to_string_pretty(&data).expect("Failed to serialize data to JSON");

        // JSONデータをファイルに書き込み

        fs::write(&file_path, &data_json).expect("Failed to write JSON data to file");

        println!("Data written to file: {}", file_path);
    }

    // データを作成
    Ok(())
}

#[tauri::command]
fn open_file(file_path: &str) -> Result<String, String> {
    let original = "start *filepath*";
    let search_str = "*filepath*";
    let replace_str = file_path;
    let mut modified_string = original.to_string();

    modified_string = modified_string.replace(search_str, replace_str);
    let final_result: &str = &modified_string;

    println!("{}", final_result);

    // let result = std::process::Command::new("cmd")
    //     .args(&["/C", final_result])
    //     .output();

    let result = std::process::Command::new("cmd")
        .arg("/C")
        .arg(final_result)
        .output();

    // let result = std::process::Command::new("start")
    //     .args(&["\"\"", file_path])
    //     .output();

    match result {
        Ok(_) => Ok("Done".to_string()),
        Err(err) => Err(err.to_string()),
    }
}

fn add_folder_contents_to_zip<W: Write + std::io::Seek>(
    folder: &Path,
    mut zip: ZipWriter<W>,
) -> io::Result<ZipWriter<W>> {
    for entry in WalkDir::new(folder) {
        let entry = entry?;
        let path = entry.path();

        if path.is_file() {
            let relative_path = path.strip_prefix(folder).unwrap();
            zip.start_file(relative_path.to_string_lossy(), Default::default())?;
            let mut file = File::open(path)?;
            io::copy(&mut file, &mut zip)?;
        }
    }

    Ok(zip)
}

#[tauri::command]
fn compress_folder(folder_path: &str, zip_path: &str) -> Result<(), String> {
    let file = File::create(zip_path).map_err(|err| err.to_string())?;
    let writer = io::BufWriter::new(file);
    let zip = ZipWriter::new(writer);

    let folder = Path::new(folder_path);

    add_folder_contents_to_zip(folder, zip).map_err(|err| err.to_string())?;

    Ok(())
}

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
    if file_extension == "jpg"
        || file_extension == "png"
        || file_extension == "gif"
        || file_extension == "webp"
        || file_extension == "svg"
        || file_extension == "bmp"
        || file_extension == "tiff"
    {
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
fn create_work_dir(dir_path: &str) -> Result<(), String> {
    fs::create_dir_all(&dir_path).map_err(|err| err.to_string())?;
    Ok(())
}

#[tauri::command]
fn upload_main_directory(file_path: String, dir_path: String) -> Result<String, String> {
    let file_extension = Path::new(&file_path)
        .extension()
        .and_then(|ext| ext.to_str())
        .unwrap_or("");

    if file_extension != "zip" {
        // 拡張子が"zip"でない場合、ディレクトリにコピーする
        let file_name = Path::new(&file_path).file_name().unwrap();
        fs::create_dir_all(&dir_path).map_err(|err| err.to_string())?;
        let target_path = Path::new(&dir_path).join(file_name);

        fs::copy(&file_path, &target_path).map_err(|err| err.to_string())?;
    } else {
        // "zip"ファイルの場合はアーカイブ展開処理を行う
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
            upload_thumbnail_to_folder,
            compress_folder,
            open_file,
            create_work_dir,
            initialize_json
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
