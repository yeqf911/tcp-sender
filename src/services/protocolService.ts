import { invoke } from '@tauri-apps/api/core';
import type { ProtocolField } from '../types/protocol-simple';

export interface Protocol {
  id: string;
  name: string;
  description?: string;
  fields: ProtocolField[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateProtocolRequest {
  name: string;
  description?: string;
  fields: ProtocolField[];
}

export interface UpdateProtocolRequest {
  id: string;
  name: string;
  description?: string;
  fields: ProtocolField[];
}

export interface ProtocolImport {
  name: string;
  description?: string;
  fields: ProtocolField[];
}

export const protocolService = {
  async listProtocols(): Promise<Protocol[]> {
    return await invoke<Protocol[]>('list_protocols');
  },

  async getProtocol(id: string): Promise<Protocol | null> {
    return await invoke<Protocol | null>('get_protocol', { id });
  },

  async createProtocol(request: CreateProtocolRequest): Promise<Protocol> {
    return await invoke<Protocol>('create_protocol', { request });
  },

  async updateProtocol(request: UpdateProtocolRequest): Promise<Protocol> {
    return await invoke<Protocol>('update_protocol', { request });
  },

  async deleteProtocol(id: string): Promise<void> {
    return await invoke<void>('delete_protocol', { id });
  },

  async exportProtocol(protocolId: string): Promise<void> {
    return await invoke<void>('export_protocol_to_file', { protocolId });
  },

  async importProtocol(): Promise<ProtocolImport> {
    return await invoke<ProtocolImport>('import_protocol_from_file');
  },
};
