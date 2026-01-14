import { useState } from 'react';
import { Button, Select, Space, Input, Tabs, message as antMessage } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { connectionService } from '../services/connectionService';
import { messageService } from '../services/messageService';
import ProtocolFieldEditor from '../components/ProtocolFieldEditor';
import type { ProtocolField } from '../types/protocol-simple';

const { TextArea } = Input;

interface Tab {
  key: string;
  label: string;
  closable: boolean;
}

export default function Messages() {
  const [activeTab, setActiveTab] = useState('1');
  const [tabs, setTabs] = useState<Tab[]>([
    { key: '1', label: '新连接 1', closable: false },
  ]);
  const [requestMode, setRequestMode] = useState<'text' | 'hex' | 'protocol'>('text');
  const [requestData, setRequestData] = useState('');
  const [responseData, setResponseData] = useState('');
  const [responseTime, setResponseTime] = useState(0);
  const [host, setHost] = useState('localhost');
  const [port, setPort] = useState('8080');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [protocolFields, setProtocolFields] = useState<ProtocolField[]>([]);

  const connectionId = `conn_${activeTab}`;

  const addTab = () => {
    const newKey = String(tabs.length + 1);
    setTabs([...tabs, { key: newKey, label: `新连接 ${newKey}`, closable: true }]);
    setActiveTab(newKey);
  };

  const removeTab = (targetKey: string) => {
    const newTabs = tabs.filter((tab) => tab.key !== targetKey);
    if (activeTab === targetKey && newTabs.length > 0) {
      setActiveTab(newTabs[newTabs.length - 1].key);
    }
    setTabs(newTabs);
  };

  const handleConnect = async () => {
    try {
      setIsLoading(true);

      // Create connection
      await connectionService.createConnection({
        id: connectionId,
        host,
        port: parseInt(port),
        timeout: 30,
        keep_alive: true,
      });

      // Connect to server
      await connectionService.connect(connectionId);

      setIsConnected(true);
    } catch (error) {
      antMessage.error(`连接失败: ${error}`);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      setIsLoading(true);
      await connectionService.disconnect(connectionId);
      await connectionService.removeConnection(connectionId);
      setIsConnected(false);
    } catch (error) {
      antMessage.error(`断开连接失败: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const buildProtocolData = (): string => {
    // Convert protocol fields to hex string
    let hexData = '';
    for (const field of protocolFields) {
      const value = field.value || '';
      // Try to parse as hex first
      if (/^[0-9A-Fa-f\s]+$/.test(value)) {
        // It's hex
        const cleanHex = value.replace(/\s/g, '');
        const paddedHex = cleanHex.padEnd(field.length * 2, '0');
        hexData += paddedHex.substring(0, field.length * 2);
      } else {
        // It's text, convert to hex
        const bytes = new TextEncoder().encode(value);
        for (let i = 0; i < field.length; i++) {
          if (i < bytes.length) {
            hexData += bytes[i].toString(16).padStart(2, '0');
          } else {
            hexData += '00';
          }
        }
      }
    }
    return hexData;
  };

  const handleSend = async () => {
    if (!isConnected) {
      antMessage.warning('请先连接到服务器');
      return;
    }

    let dataToSend = requestData;
    let mode: 'text' | 'hex' = requestMode === 'protocol' ? 'hex' : requestMode;

    if (requestMode === 'protocol') {
      if (protocolFields.length === 0) {
        antMessage.warning('请添加协议字段');
        return;
      }
      dataToSend = buildProtocolData();
    } else if (!requestData.trim()) {
      antMessage.warning('请输入要发送的数据');
      return;
    }

    try {
      setIsLoading(true);
      setResponseData('');

      const response = await messageService.sendMessage({
        connection_id: connectionId,
        data: dataToSend,
        mode: mode,
      });

      if (response.success) {
        setResponseData(response.response_data);
        setResponseTime(response.response_time_ms);
      } else {
        antMessage.error(`发送失败: ${response.error}`);
      }
    } catch (error) {
      antMessage.error(`发送失败: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#1e1e1e' }}>
      {/* Top Toolbar */}
      <div
        style={{
          padding: '8px 16px',
          background: '#252526',
          borderBottom: '1px solid #3e3e42',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <Select
          placeholder="选择连接"
          style={{ width: 200 }}
          options={[
            { value: '1', label: 'localhost:8080' },
            { value: '2', label: '192.168.1.100:9000' },
          ]}
        />
        <Input
          placeholder="主机地址"
          style={{ width: 150 }}
          value={host}
          onChange={(e) => setHost(e.target.value)}
          disabled={isConnected}
        />
        <Input
          placeholder="端口"
          style={{ width: 100 }}
          value={port}
          onChange={(e) => setPort(e.target.value)}
          disabled={isConnected}
        />
        {!isConnected ? (
          <Button type="primary" onClick={handleConnect} loading={isLoading}>
            连接
          </Button>
        ) : (
          <>
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSend}
              loading={isLoading}
            >
              发送
            </Button>
            <Button onClick={handleDisconnect} loading={isLoading}>
              断开
            </Button>
          </>
        )}
      </div>

      {/* Tabs */}
      <div style={{ background: '#252526', borderBottom: '1px solid #3e3e42' }}>
        <Tabs
          type="editable-card"
          activeKey={activeTab}
          onChange={setActiveTab}
          onEdit={(targetKey, action) => {
            if (action === 'add') addTab();
            else if (action === 'remove') removeTab(targetKey as string);
          }}
          items={tabs.map((tab) => ({
            key: tab.key,
            label: tab.label,
            closable: tab.closable,
          }))}
          style={{ margin: 0 }}
        />
      </div>

      {/* Split Workspace */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Request Editor (Top Half) */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            borderBottom: '1px solid #3e3e42',
            minHeight: 200,
          }}
        >
          <div
            style={{
              padding: '8px 16px',
              background: '#252526',
              borderBottom: '1px solid #3e3e42',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Space>
              <span style={{ color: '#cccccc', fontSize: 13, fontWeight: 500 }}>请求</span>
              <Select
                value={requestMode}
                onChange={setRequestMode}
                style={{ width: 120 }}
                options={[
                  { value: 'text', label: 'Text' },
                  { value: 'hex', label: 'Hex' },
                  { value: 'protocol', label: 'Protocol' },
                ]}
                size="small"
              />
            </Space>
            <Space>
              <Button size="small" onClick={() => {
                if (requestMode === 'protocol') {
                  setProtocolFields([]);
                } else {
                  setRequestData('');
                }
              }}>清空</Button>
              <Button size="small">格式化</Button>
            </Space>
          </div>
          <div style={{ flex: 1, padding: 16, overflow: 'auto' }}>
            {requestMode === 'protocol' ? (
              <ProtocolFieldEditor
                fields={protocolFields}
                onChange={setProtocolFields}
              />
            ) : (
              <TextArea
                value={requestData}
                onChange={(e) => setRequestData(e.target.value)}
                placeholder={
                  requestMode === 'text'
                    ? '输入要发送的文本数据...'
                    : '输入十六进制数据 (例如: 01 02 03 FF)'
                }
                style={{
                  height: '100%',
                  fontFamily: 'JetBrains Mono, Consolas, Monaco, monospace',
                  fontSize: 13,
                  background: '#1e1e1e',
                  border: '1px solid #3e3e42',
                  color: '#cccccc',
                  resize: 'none',
                }}
              />
            )}
          </div>
        </div>

        {/* Response Viewer (Bottom Half) */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 200 }}>
          <div
            style={{
              padding: '8px 16px',
              background: '#252526',
              borderBottom: '1px solid #3e3e42',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Space>
              <span style={{ color: '#cccccc', fontSize: 13, fontWeight: 500 }}>响应</span>
              <span style={{ color: '#858585', fontSize: 12 }}>{responseTime} ms</span>
            </Space>
            <Space>
              <Button size="small">复制</Button>
              <Button size="small">保存</Button>
            </Space>
          </div>
          <div style={{ flex: 1, padding: 16, overflow: 'auto' }}>
            <TextArea
              value={responseData}
              readOnly
              placeholder="响应数据将显示在这里..."
              style={{
                height: '100%',
                fontFamily: 'JetBrains Mono, Consolas, Monaco, monospace',
                fontSize: 13,
                background: '#1e1e1e',
                border: '1px solid #3e3e42',
                color: '#4ec9b0',
                resize: 'none',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
