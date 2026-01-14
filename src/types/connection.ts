export interface Connection {
  id: string;
  name: string;
  host: string;
  port: number;
  timeout: number;
  keepAlive: boolean;
  autoReconnect: boolean;
  reconnectInterval: number;
  encoding: 'utf8' | 'gbk' | 'ascii';
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  lastConnectedAt?: Date;
}

export interface ConnectionStatus {
  id: string;
  isConnected: boolean;
  lastActivity?: Date;
  error?: string;
}
