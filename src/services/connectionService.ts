import { invoke } from '@tauri-apps/api/core';

export interface ConnectionConfig {
  id: string;
  host: string;
  port: number;
  timeout: number;
  keep_alive: boolean;
}

export interface CommandResult {
  success: boolean;
  message: string;
}

export const connectionService = {
  async createConnection(config: ConnectionConfig): Promise<CommandResult> {
    return await invoke<CommandResult>('create_connection', { config });
  },

  async connect(connectionId: string): Promise<CommandResult> {
    return await invoke<CommandResult>('connect_to_server', { connectionId });
  },

  async disconnect(connectionId: string): Promise<CommandResult> {
    return await invoke<CommandResult>('disconnect_from_server', { connectionId });
  },

  async checkStatus(connectionId: string): Promise<boolean> {
    return await invoke<boolean>('check_connection_status', { connectionId });
  },

  async removeConnection(connectionId: string): Promise<CommandResult> {
    return await invoke<CommandResult>('remove_connection', { connectionId });
  },

  async listConnections(): Promise<string[]> {
    return await invoke<string[]>('list_connections');
  },
};
