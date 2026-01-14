-- 002_create_protocols.sql
CREATE TABLE IF NOT EXISTS protocols (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    version TEXT NOT NULL,
    description TEXT,
    fields TEXT NOT NULL, -- JSON序列化的字段定义
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);

CREATE INDEX idx_protocols_name ON protocols(name);
CREATE INDEX idx_protocols_name_version ON protocols(name, version);
