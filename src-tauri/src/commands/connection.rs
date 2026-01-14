use crate::tcp::{ConnectionManager, TcpClientConfig};
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use tauri::State;

#[derive(Debug, Serialize, Deserialize)]
pub struct ConnectionConfig {
    pub id: String,
    pub host: String,
    pub port: u16,
    pub timeout: u64,
    pub keep_alive: bool,
}

#[derive(Debug, Serialize)]
pub struct CommandResult {
    pub success: bool,
    pub message: String,
}

#[tauri::command]
pub async fn create_connection(
    manager: State<'_, Arc<ConnectionManager>>,
    config: ConnectionConfig,
) -> Result<CommandResult, String> {
    let tcp_config = TcpClientConfig {
        host: config.host.clone(),
        port: config.port,
        timeout_secs: config.timeout,
        keep_alive: config.keep_alive,
    };

    manager
        .create_connection(config.id.clone(), tcp_config)
        .await
        .map_err(|e| e.to_string())?;

    Ok(CommandResult {
        success: true,
        message: format!("Connection '{}' created successfully", config.id),
    })
}

#[tauri::command]
pub async fn connect_to_server(
    manager: State<'_, Arc<ConnectionManager>>,
    connection_id: String,
) -> Result<CommandResult, String> {
    manager
        .connect(&connection_id)
        .await
        .map_err(|e| e.to_string())?;

    Ok(CommandResult {
        success: true,
        message: format!("Connected to server via '{}'", connection_id),
    })
}

#[tauri::command]
pub async fn disconnect_from_server(
    manager: State<'_, Arc<ConnectionManager>>,
    connection_id: String,
) -> Result<CommandResult, String> {
    manager
        .disconnect(&connection_id)
        .await
        .map_err(|e| e.to_string())?;

    Ok(CommandResult {
        success: true,
        message: format!("Disconnected from '{}'", connection_id),
    })
}

#[tauri::command]
pub async fn check_connection_status(
    manager: State<'_, Arc<ConnectionManager>>,
    connection_id: String,
) -> Result<bool, String> {
    manager
        .is_connected(&connection_id)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn remove_connection(
    manager: State<'_, Arc<ConnectionManager>>,
    connection_id: String,
) -> Result<CommandResult, String> {
    manager
        .remove_connection(&connection_id)
        .await
        .map_err(|e| e.to_string())?;

    Ok(CommandResult {
        success: true,
        message: format!("Connection '{}' removed", connection_id),
    })
}

#[tauri::command]
pub async fn list_connections(
    manager: State<'_, Arc<ConnectionManager>>,
) -> Result<Vec<String>, String> {
    Ok(manager.list_connections().await)
}
