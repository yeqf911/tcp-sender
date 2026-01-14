import { invoke } from '@tauri-apps/api/core';

export interface SendMessageRequest {
  connection_id: string;
  data: string;
  mode: 'text' | 'hex';
}

export interface SendMessageResponse {
  success: boolean;
  response_data: string;
  response_time_ms: number;
  error?: string;
}

export const messageService = {
  async sendMessage(request: SendMessageRequest): Promise<SendMessageResponse> {
    return await invoke<SendMessageResponse>('send_message', { request });
  },

  async sendOnly(request: SendMessageRequest): Promise<SendMessageResponse> {
    return await invoke<SendMessageResponse>('send_only', { request });
  },

  async receiveOnly(
    connectionId: string,
    mode: 'text' | 'hex'
  ): Promise<SendMessageResponse> {
    return await invoke<SendMessageResponse>('receive_only', {
      connectionId,
      mode,
    });
  },
};
