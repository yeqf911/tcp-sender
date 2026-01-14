export interface MessageRecord {
  id: string;
  connectionId: string;
  protocolId?: string;
  direction: 'send' | 'receive';
  content: string; // Hex编码的原始数据
  parsedData?: any;
  timestamp: Date;
  responseTime?: number;
  status: 'success' | 'error' | 'timeout';
  error?: string;
}
