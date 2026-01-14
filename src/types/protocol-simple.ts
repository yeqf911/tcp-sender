export interface ProtocolField {
  id: string;
  name: string;
  length: number; // in bytes
  value: string;
  description?: string;
}

export interface Protocol {
  id: string;
  name: string;
  description?: string;
  fields: ProtocolField[];
}
