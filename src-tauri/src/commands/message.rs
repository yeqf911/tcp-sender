use crate::tcp::ConnectionManager;
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use std::time::Instant;
use tauri::State;

#[derive(Debug, Serialize, Deserialize)]
pub struct SendMessageRequest {
    pub connection_id: String,
    pub data: String,
    pub mode: String, // "text" or "hex"
}

#[derive(Debug, Serialize)]
pub struct SendMessageResponse {
    pub success: bool,
    pub response_data: String,
    pub response_time_ms: u64,
    pub error: Option<String>,
}

fn hex_string_to_bytes(hex: &str) -> Result<Vec<u8>, String> {
    let hex = hex.replace(" ", "").replace("\n", "").replace("\r", "");

    if hex.len() % 2 != 0 {
        return Err("Hex string must have even length".to_string());
    }

    (0..hex.len())
        .step_by(2)
        .map(|i| {
            u8::from_str_radix(&hex[i..i + 2], 16)
                .map_err(|e| format!("Invalid hex at position {}: {}", i, e))
        })
        .collect()
}

fn bytes_to_hex_string(bytes: &[u8]) -> String {
    bytes
        .iter()
        .map(|b| format!("{:02X}", b))
        .collect::<Vec<_>>()
        .join(" ")
}

#[tauri::command]
pub async fn send_message(
    manager: State<'_, Arc<ConnectionManager>>,
    request: SendMessageRequest,
) -> Result<SendMessageResponse, String> {
    let start = Instant::now();

    // Convert data based on mode
    let data_bytes = match request.mode.as_str() {
        "text" => request.data.as_bytes().to_vec(),
        "hex" => hex_string_to_bytes(&request.data)?,
        _ => return Err(format!("Invalid mode: {}", request.mode)),
    };

    // Send and receive
    let response_bytes = manager
        .send_and_receive(&request.connection_id, &data_bytes, 4096)
        .await
        .map_err(|e| e.to_string())?;

    let elapsed = start.elapsed();

    // Convert response based on mode
    let response_data = match request.mode.as_str() {
        "text" => String::from_utf8_lossy(&response_bytes).to_string(),
        "hex" => bytes_to_hex_string(&response_bytes),
        _ => String::new(),
    };

    Ok(SendMessageResponse {
        success: true,
        response_data,
        response_time_ms: elapsed.as_millis() as u64,
        error: None,
    })
}

#[tauri::command]
pub async fn send_only(
    manager: State<'_, Arc<ConnectionManager>>,
    request: SendMessageRequest,
) -> Result<SendMessageResponse, String> {
    let start = Instant::now();

    // Convert data based on mode
    let data_bytes = match request.mode.as_str() {
        "text" => request.data.as_bytes().to_vec(),
        "hex" => hex_string_to_bytes(&request.data)?,
        _ => return Err(format!("Invalid mode: {}", request.mode)),
    };

    // Send only
    manager
        .send(&request.connection_id, &data_bytes)
        .await
        .map_err(|e| e.to_string())?;

    let elapsed = start.elapsed();

    Ok(SendMessageResponse {
        success: true,
        response_data: String::new(),
        response_time_ms: elapsed.as_millis() as u64,
        error: None,
    })
}

#[tauri::command]
pub async fn receive_only(
    manager: State<'_, Arc<ConnectionManager>>,
    connection_id: String,
    mode: String,
) -> Result<SendMessageResponse, String> {
    let start = Instant::now();

    // Receive data
    let response_bytes = manager
        .receive(&connection_id, 4096)
        .await
        .map_err(|e| e.to_string())?;

    let elapsed = start.elapsed();

    // Convert response based on mode
    let response_data = match mode.as_str() {
        "text" => String::from_utf8_lossy(&response_bytes).to_string(),
        "hex" => bytes_to_hex_string(&response_bytes),
        _ => String::new(),
    };

    Ok(SendMessageResponse {
        success: true,
        response_data,
        response_time_ms: elapsed.as_millis() as u64,
        error: None,
    })
}
