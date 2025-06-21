use std::process::Command;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  // Inicia o backend ao abrir o app
  #[cfg(target_os = "windows")]
  {
    // Tenta iniciar o backend usando o caminho relativo ao executável
    let _ = Command::new("cmd")
      .args(["/C", "start", "/min", "run_backend.bat"])
      .current_dir(std::env::current_exe().unwrap().parent().unwrap())
      .spawn();
    
    // Aguarda um pouco para o backend inicializar
    std::thread::sleep(std::time::Duration::from_secs(5));
  }
  tauri::Builder::default()
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
