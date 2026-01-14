mod commands;
mod tcp;

use std::sync::Arc;
use tcp::ConnectionManager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let connection_manager = Arc::new(ConnectionManager::new());

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(connection_manager)
        .invoke_handler(tauri::generate_handler![
            commands::create_connection,
            commands::connect_to_server,
            commands::disconnect_from_server,
            commands::check_connection_status,
            commands::remove_connection,
            commands::list_connections,
            commands::send_message,
            commands::send_only,
            commands::receive_only,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
