-- 004_create_test_tables.sql
CREATE TABLE IF NOT EXISTS test_cases (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    protocol_id TEXT NOT NULL,
    connection_id TEXT NOT NULL,
    description TEXT,
    steps TEXT NOT NULL, -- JSON
    assertions TEXT NOT NULL, -- JSON
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    FOREIGN KEY (protocol_id) REFERENCES protocols(id) ON DELETE CASCADE,
    FOREIGN KEY (connection_id) REFERENCES connections(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS test_results (
    id TEXT PRIMARY KEY,
    test_case_id TEXT NOT NULL,
    start_time INTEGER NOT NULL,
    end_time INTEGER NOT NULL,
    status TEXT NOT NULL, -- 'passed', 'failed', 'error'
    steps TEXT NOT NULL, -- JSON
    assertions TEXT NOT NULL, -- JSON
    summary TEXT NOT NULL, -- JSON
    FOREIGN KEY (test_case_id) REFERENCES test_cases(id) ON DELETE CASCADE
);

CREATE INDEX idx_test_cases_name ON test_cases(name);
CREATE INDEX idx_test_cases_protocol ON test_cases(protocol_id);
CREATE INDEX idx_test_results_case ON test_results(test_case_id);
CREATE INDEX idx_test_results_time ON test_results(start_time DESC);
