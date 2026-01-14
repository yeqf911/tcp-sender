import { Button, Input, InputNumber, Table, Popconfirm } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ProtocolField } from '../types/protocol-simple';

interface ProtocolFieldEditorProps {
  fields: ProtocolField[];
  onChange: (fields: ProtocolField[]) => void;
}

export default function ProtocolFieldEditor({ fields, onChange }: ProtocolFieldEditorProps) {
  const addField = () => {
    const newField: ProtocolField = {
      id: `field_${Date.now()}`,
      name: `字段${fields.length + 1}`,
      length: 1,
      value: '',
    };
    onChange([...fields, newField]);
  };

  const updateField = (id: string, updates: Partial<ProtocolField>) => {
    onChange(
      fields.map((field) =>
        field.id === id ? { ...field, ...updates } : field
      )
    );
  };

  const deleteField = (id: string) => {
    onChange(fields.filter((field) => field.id !== id));
  };

  const columns = [
    {
      title: '字段名',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      render: (text: string, record: ProtocolField) => (
        <Input
          value={text}
          onChange={(e) => updateField(record.id, { name: e.target.value })}
          placeholder="字段名"
          size="small"
          style={{
            background: '#1e1e1e',
            border: '1px solid #3e3e42',
            color: '#cccccc',
          }}
        />
      ),
    },
    {
      title: '长度(字节)',
      dataIndex: 'length',
      key: 'length',
      width: 120,
      render: (length: number, record: ProtocolField) => (
        <InputNumber
          value={length}
          onChange={(value) => updateField(record.id, { length: value || 1 })}
          min={1}
          max={1024}
          size="small"
          style={{
            width: '100%',
            background: '#1e1e1e',
            border: '1px solid #3e3e42',
            color: '#cccccc',
          }}
        />
      ),
    },
    {
      title: '值',
      dataIndex: 'value',
      key: 'value',
      render: (text: string, record: ProtocolField) => (
        <Input
          value={text}
          onChange={(e) => updateField(record.id, { value: e.target.value })}
          placeholder="输入数据（文本或十六进制）"
          size="small"
          style={{
            background: '#1e1e1e',
            border: '1px solid #3e3e42',
            color: '#cccccc',
          }}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      render: (_: any, record: ProtocolField) => (
        <Popconfirm
          title="确定删除此字段？"
          onConfirm={() => deleteField(record.id)}
          okText="确定"
          cancelText="取消"
        >
          <Button
            type="text"
            danger
            size="small"
            icon={<DeleteOutlined />}
          />
        </Popconfirm>
      ),
    },
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: 8 }}>
        <Button
          type="dashed"
          icon={<PlusOutlined />}
          onClick={addField}
          size="small"
          style={{
            borderColor: '#3e3e42',
            color: '#cccccc',
          }}
        >
          添加字段
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={fields}
        rowKey="id"
        pagination={false}
        size="small"
        scroll={{ y: 'calc(100% - 40px)' }}
        style={{
          flex: 1,
          background: '#252526',
        }}
      />
    </div>
  );
}
