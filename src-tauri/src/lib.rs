mod commands;
mod tcp;
mod database;
mod models;

use std::sync::Arc;
use tcp::ConnectionManager;
use database::DbPool;
use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let connection_manager = Arc::new(ConnectionManager::new());

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(connection_manager)
        .manage(DbPool::new())
        .setup(|app| {
            // Initialize database
            let db = database::Database::open(app.handle())?;
            // Get the db_pool from state and initialize it
            app.state::<DbPool>().init(db);
            Ok(())
        })
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
            // Protocol commands
            commands::list_protocols,
            commands::get_protocol,
            commands::create_protocol,
            commands::update_protocol,
            commands::delete_protocol,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
