import { useState } from 'react';
import {
  Button,
  Table,
  Input,
  Select,
  Space,
  Tag,
  Modal,
  Form,
  message,
  Tooltip,
  Dropdown,
} from 'antd';
import {
  PlusOutlined,
  ImportOutlined,
  ExportOutlined,
  ReloadOutlined,
  SendOutlined,
  EditOutlined,
  DeleteOutlined,
  LinkOutlined as LinkConnectedIcon,
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
  MoreOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

// 模拟连接数据类型
interface ConnectionConfig {
  id: string;
  name: string;
  host: string;
  port: number;
  status: 'connected' | 'disconnected' | 'connecting' | 'error';
  description?: string;
  tags: string[];
  uptime?: number; // 秒
  traffic?: {
    sent: number;
    received: number;
  };
}

// 模拟数据
const mockConnections: ConnectionConfig[] = [
  {
    id: '1',
    name: 'Dev API',
    host: 'localhost',
    port: 8080,
    status: 'connected',
    description: 'Local development API server',
    tags: ['Dev', 'API'],
    uptime: 300,
    traffic: { sent: 1024, received: 2048 },
  },
  {
    id: '2',
    name: 'Prod DB',
    host: '192.168.1.10',
    port: 3306,
    status: 'disconnected',
    description: 'Production MySQL database',
    tags: ['Prod', 'DB'],
  },
  {
    id: '3',
    name: 'Test Server',
    host: '10.0.0.5',
    port: 9000,
    status: 'error',
    description: 'Test environment server',
    tags: ['Test'],
  },
];

export default function Connections() {
  const [connections, setConnections] = useState<ConnectionConfig[]>(mockConnections);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [tagFilter, setTagFilter] = useState<string>('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingConnection, setEditingConnection] = useState<ConnectionConfig | null>(null);
  const [form] = Form.useForm();

  // 获取所有标签
  const allTags = Array.from(new Set(connections.flatMap((c) => c.tags)));

  // 过滤连接
  const filteredConnections = connections.filter((conn) => {
    const matchSearch =
      conn.name.toLowerCase().includes(searchText.toLowerCase()) ||
      conn.host.toLowerCase().includes(searchText.toLowerCase()) ||
      `${conn.port}`.includes(searchText);
    const matchTag = tagFilter === 'all' || conn.tags.includes(tagFilter);
    return matchSearch && matchTag;
  });

  // 状态渲染
  const renderStatus = (status: ConnectionConfig['status']) => {
    switch (status) {
      case 'connected':
        return (
          <Tooltip title="Connected">
            <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 16 }} />
          </Tooltip>
        );
      case 'disconnected':
        return (
          <Tooltip title="Disconnected">
            <CloseCircleOutlined style={{ color: '#8c8c8c', fontSize: 16 }} />
          </Tooltip>
        );
      case 'connecting':
        return (
          <Tooltip title="Connecting...">
            <LoadingOutlined style={{ color: '#faad14', fontSize: 16 }} spin />
          </Tooltip>
        );
      case 'error':
        return (
          <Tooltip title="Connection error">
            <CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: 16 }} />
          </Tooltip>
        );
      default:
        return null;
    }
  };

  // 格式化流量
  const formatTraffic = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // 格式化运行时间
  const formatUptime = (seconds?: number) => {
    if (!seconds) return '-';
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    return `${Math.floor(seconds / 3600)}h`;
  };

  // 操作菜单
  const getActionMenu = (record: ConnectionConfig) => ({
    items: [
      {
        key: 'connect',
        icon: <LinkConnectedIcon />,
        label: record.status === 'connected' ? 'Disconnect' : 'Connect',
        onClick: () => handleToggleConnection(record),
      },
      {
        key: 'send',
        icon: <SendOutlined />,
        label: 'Send Message',
        disabled: record.status !== 'connected',
      },
      { type: 'divider' as const },
      {
        key: 'edit',
        icon: <EditOutlined />,
        label: 'Edit',
        onClick: () => handleEdit(record),
      },
      {
        key: 'delete',
        icon: <DeleteOutlined />,
        label: 'Delete',
        danger: true,
        onClick: () => handleDelete(record),
      },
    ],
  });

  // 切换连接状态
  const handleToggleConnection = (record: ConnectionConfig) => {
    const newStatus =
      record.status === 'connected' ? 'disconnected' : 'connecting';

    setConnections((prev) =>
      prev.map((c) =>
        c.id === record.id ? { ...c, status: newStatus } : c
      )
    );

    if (newStatus === 'connecting') {
      setTimeout(() => {
        setConnections((prev) =>
          prev.map((c) =>
            c.id === record.id ? { ...c, status: 'connected' } : c
          )
        );
      }, 1000);
    }
  };

  // 新建连接
  const handleCreate = () => {
    setEditingConnection(null);
    form.resetFields();
    setModalVisible(true);
  };

  // 编辑连接
  const handleEdit = (record: ConnectionConfig) => {
    setEditingConnection(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  // 删除连接
  const handleDelete = (record: ConnectionConfig) => {
    Modal.confirm({
      title: 'Delete Connection',
      content: `Are you sure to delete connection "${record.name}"?`,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => {
        setConnections((prev) => prev.filter((c) => c.id !== record.id));
        message.success('Connection deleted');
      },
    });
  };

  // 保存连接
  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      if (editingConnection) {
        // 更新
        setConnections((prev) =>
          prev.map((c) =>
            c.id === editingConnection.id
              ? { ...c, ...values, tags: values.tags || [] }
              : c
          )
        );
        message.success('Connection updated');
      } else {
        // 新建
        const newConnection: ConnectionConfig = {
          id: Date.now().toString(),
          ...values,
          status: 'disconnected',
          tags: values.tags || [],
        };
        setConnections((prev) => [...prev, newConnection]);
        message.success('Connection created');
      }

      setModalVisible(false);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  // 表格列定义
  const columns: ColumnsType<ConnectionConfig> = [
    {
      title: 'Status',
      dataIndex: 'status',
      width: 70,
      render: renderStatus,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: ConnectionConfig) => (
        <div>
          <div style={{ color: '#cccccc', fontWeight: 500 }}>{text}</div>
          {record.description && (
            <div style={{ color: '#858585', fontSize: 12 }}>
              {record.description}
            </div>
          )}
          <div style={{ color: '#858585', fontSize: 12, marginTop: 2 }}>
            {record.host}:{record.port}
          </div>
        </div>
      ),
    },
    {
      title: 'Info',
      key: 'info',
      width: 140,
      render: (_: any, record: ConnectionConfig) => (
        <div style={{ fontSize: 12, color: '#858585' }}>
          {record.status === 'connected' && record.uptime && (
            <div>Uptime: {formatUptime(record.uptime)}</div>
          )}
          {record.traffic && record.status === 'connected' && (
            <>
              <div>↑ {formatTraffic(record.traffic.sent)}</div>
              <div>↓ {formatTraffic(record.traffic.received)}</div>
            </>
          )}
        </div>
      ),
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tags',
      width: 120,
      render: (tags: string[]) => (
        <>
          {tags.map((tag) => (
            <Tag
              key={tag}
              style={{
                margin: '2px',
                background: 'rgba(255, 108, 55, 0.1)',
                border: '1px solid rgba(255, 108, 55, 0.3)',
                color: '#ff6c37',
              }}
            >
              {tag}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 90,
      render: (_: any, record: ConnectionConfig) => (
        <Dropdown menu={getActionMenu(record)} trigger={['click']}>
          <Button
            type="text"
            size="small"
            icon={<MoreOutlined />}
            style={{ color: '#cccccc' }}
          />
        </Dropdown>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Space size="large">
          <span style={{ color: '#cccccc', fontSize: 18, fontWeight: 500 }}>
            Connections
          </span>
          <Button icon={<PlusOutlined />} type="primary" onClick={handleCreate}>
            New Connection
          </Button>
        </Space>
        <Space>
          <Button icon={<ImportOutlined />} size="small">
            Import
          </Button>
          <Button icon={<ExportOutlined />} size="small">
            Export
          </Button>
          <Button icon={<ReloadOutlined />} size="small" onClick={() => setLoading(!loading)}>
            Refresh
          </Button>
        </Space>
      </div>

      {/* Filter Bar */}
      <div
        style={{
          marginBottom: 16,
          padding: 12,
          background: '#252526',
          borderRadius: 4,
          display: 'flex',
          gap: 12,
          alignItems: 'center',
        }}
      >
        <Input
          placeholder="Search connections..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          prefix={<SearchOutlined />}
          style={{ width: 240 }}
          allowClear
        />
        <Select
          value={tagFilter}
          onChange={setTagFilter}
          style={{ width: 140 }}
          options={[
            { value: 'all', label: 'All Tags' },
            ...allTags.map((tag) => ({ value: tag, label: tag })),
          ]}
        />
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={filteredConnections}
        rowKey="id"
        loading={loading}
        pagination={false}
        size="small"
        locale={{
          emptyText: (
            <div style={{ color: '#858585', padding: 40 }}>
              No connections yet. Click "New Connection" to add one.
            </div>
          ),
        }}
        style={{
          flex: 1,
          background: '#252526',
        }}
        scroll={{ y: 'calc(100vh - 240px)' }}
        rowClassName={(record) => {
          if (record.status === 'connected') return 'row-connected';
          if (record.status === 'error') return 'row-error';
          return '';
        }}
      />

      {/* Edit/Create Modal */}
      <Modal
        title={editingConnection ? 'Edit Connection' : 'New Connection'}
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => setModalVisible(false)}
        width={500}
        okText="Save"
        cancelText="Cancel"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            host: '127.0.0.1',
            port: 8080,
            timeout: 30,
            keepAlive: true,
            tags: [],
          }}
        >
          <Form.Item
            name="name"
            label="Connection Name"
            rules={[{ required: true, message: 'Please enter connection name' }]}
          >
            <Input placeholder="e.g. Dev API Server" />
          </Form.Item>
          <Form.Item
            name="host"
            label="Host"
            rules={[{ required: true, message: 'Please enter host' }]}
          >
            <Input placeholder="127.0.0.1" />
          </Form.Item>
          <Form.Item
            name="port"
            label="Port"
            rules={[{ required: true, message: 'Please enter port' }]}
          >
            <Input type="number" placeholder="8080" min={1} max={65535} />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea placeholder="Optional description" rows={2} />
          </Form.Item>
          <Form.Item name="tags" label="Tags">
            <Select
              mode="tags"
              placeholder="Add tags (Dev, Prod, API...)"
              options={['Dev', 'Prod', 'Test', 'API', 'DB', 'Cache'].map(tag => ({ value: tag, label: tag }))}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
