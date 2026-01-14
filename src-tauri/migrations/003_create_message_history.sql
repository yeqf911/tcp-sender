-- 003_create_message_history.sql
CREATE TABLE IF NOT EXISTS message_history (
    id TEXT PRIMARY KEY,
    connection_id TEXT NOT NULL,
    protocol_id TEXT,
    direction TEXT NOT NULL, -- 'send' or 'receive'
    content BLOB NOT NULL,
    parsed_data TEXT, -- JSON
    timestamp INTEGER NOT NULL,
    response_time INTEGER,
    status TEXT NOT NULL, -- 'success', 'error', 'timeout'
    error TEXT,
    FOREIGN KEY (connection_id) REFERENCES connections(id) ON DELETE CASCADE,
    FOREIGN KEY (protocol_id) REFERENCES protocols(id) ON DELETE SET NULL
);

CREATE INDEX idx_history_connection ON message_history(connection_id);
CREATE INDEX idx_history_timestamp ON message_history(timestamp DESC);
CREATE INDEX idx_history_status ON message_history(status);
