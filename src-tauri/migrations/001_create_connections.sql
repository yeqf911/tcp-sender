-- 001_create_connections.sql
CREATE TABLE IF NOT EXISTS connections (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    host TEXT NOT NULL,
    port INTEGER NOT NULL,
    timeout INTEGER NOT NULL DEFAULT 30,
    keep_alive BOOLEAN NOT NULL DEFAULT 0,
    auto_reconnect BOOLEAN NOT NULL DEFAULT 0,
    reconnect_interval INTEGER NOT NULL DEFAULT 5,
    encoding TEXT NOT NULL DEFAULT 'utf8',
    description TEXT,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    last_connected_at INTEGER
);

CREATE INDEX idx_connections_name ON connections(name);
CREATE INDEX idx_connections_host_port ON connections(host, port);
