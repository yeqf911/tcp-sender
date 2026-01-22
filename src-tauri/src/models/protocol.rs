use serde::{Deserialize, Serialize};
use std::default::Default;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProtocolField {
    pub id: String,
    pub name: String,
    pub length: Option<i32>,
    #[serde(rename = "isVariable", default)]
    pub is_variable: bool,
    #[serde(rename = "valueType", default)]
    pub value_type: String, // "text" or "hex"
    #[serde(rename = "valueFormat", skip_serializing_if = "Option::is_none")]
    pub value_format: Option<String>, // "dec" or "hex" for non-variable fields
    pub value: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
}

impl Default for ProtocolField {
    fn default() -> Self {
        Self {
            id: String::new(),
            name: String::new(),
            length: None,
            is_variable: false,
            value_type: "hex".to_string(),
            value_format: None,
            value: String::new(),
            description: None,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Protocol {
    pub id: String,
    pub name: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
    pub fields: Vec<ProtocolField>,
    #[serde(rename = "createdAt")]
    pub created_at: String,
    #[serde(rename = "updatedAt")]
    pub updated_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateProtocolRequest {
    pub name: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
    pub fields: Vec<ProtocolField>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UpdateProtocolRequest {
    pub id: String,
    pub name: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
    pub fields: Vec<ProtocolField>,
}

/// Protocol data for import/export (without id)
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProtocolImport {
    pub name: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
    pub fields: Vec<ProtocolFieldExport>,
}

/// Field for export - conditional fields based on isVariable
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProtocolFieldExport {
    pub id: String,
    pub name: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub length: Option<i32>,
    #[serde(rename = "isVariable", default)]
    pub is_variable: bool,
    /// Only for variable fields (text/hex)
    #[serde(rename = "valueType", skip_serializing_if = "Option::is_none")]
    pub value_type: Option<String>,
    /// Only for non-variable fields (dec/hex/bin)
    #[serde(rename = "valueFormat", skip_serializing_if = "Option::is_none")]
    pub value_format: Option<String>,
    pub value: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
    /// Track enabled state
    #[serde(default)]
    pub enabled: bool,
}

impl From<ProtocolField> for ProtocolFieldExport {
    fn from(field: ProtocolField) -> Self {
        Self {
            id: field.id,
            name: field.name,
            length: field.length,
            is_variable: field.is_variable,
            value_type: if field.is_variable { Some(field.value_type) } else { None },
            value_format: if !field.is_variable { field.value_format } else { None },
            value: field.value,
            description: field.description,
            enabled: true,
        }
    }
}

impl From<ProtocolFieldExport> for ProtocolField {
    fn from(field: ProtocolFieldExport) -> Self {
        Self {
            id: field.id,
            name: field.name,
            length: field.length,
            is_variable: field.is_variable,
            value_type: field.value_type.unwrap_or_else(|| if field.is_variable { "text".to_string() } else { "hex".to_string() }),
            value_format: field.value_format,
            value: field.value,
            description: field.description,
        }
    }
}
