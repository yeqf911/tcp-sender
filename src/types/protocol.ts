export type FieldType =
  | 'int8' | 'int16' | 'int32' | 'int64'
  | 'uint8' | 'uint16' | 'uint32' | 'uint64'
  | 'float32' | 'float64'
  | 'string' | 'bytes' | 'enum';

export interface EnumOption {
  label: string;
  value: number | string;
}

export interface FieldValidation {
  min?: number;
  max?: number;
  regex?: string;
  custom?: string;
}

export interface ProtocolField {
  id: string;
  name: string;
  type: FieldType;
  length?: number;
  offset?: number;
  endianness: 'big' | 'little';
  encoding?: string;
  defaultValue?: any;
  required: boolean;
  description?: string;
  validation?: FieldValidation;
  enumOptions?: EnumOption[];
}

export interface Protocol {
  id: string;
  name: string;
  version: string;
  description?: string;
  fields: ProtocolField[];
  createdAt: Date;
  updatedAt: Date;
}
