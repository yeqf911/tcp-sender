import { Card, Typography, Row, Col, Statistic } from 'antd';
import {
  ApiOutlined,
  SendOutlined,
  HistoryOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

export default function Home() {
  return (
    <div style={{ padding: 24, height: '100%', overflow: 'auto' }}>
      <Card
        style={{
          background: '#252526',
          border: '1px solid #3e3e42',
          marginBottom: 24,
        }}
      >
        <Title level={2} style={{ color: '#cccccc', marginTop: 0 }}>
          欢迎使用 TCP 报文发送工具
        </Title>
        <Paragraph style={{ color: '#858585', fontSize: 14 }}>
          这是一个功能强大的 TCP 测试工具，类似于 Postman，专为 TCP 协议设计。
        </Paragraph>
      </Card>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card
            style={{
              background: '#252526',
              border: '1px solid #3e3e42',
              textAlign: 'center',
            }}
          >
            <Statistic
              title={<span style={{ color: '#858585' }}>活动连接</span>}
              value={0}
              prefix={<ApiOutlined style={{ color: '#ff6c37' }} />}
              valueStyle={{ color: '#cccccc' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card
            style={{
              background: '#252526',
              border: '1px solid #3e3e42',
              textAlign: 'center',
            }}
          >
            <Statistic
              title={<span style={{ color: '#858585' }}>已发送</span>}
              value={0}
              prefix={<SendOutlined style={{ color: '#4ec9b0' }} />}
              valueStyle={{ color: '#cccccc' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card
            style={{
              background: '#252526',
              border: '1px solid #3e3e42',
              textAlign: 'center',
            }}
          >
            <Statistic
              title={<span style={{ color: '#858585' }}>历史记录</span>}
              value={0}
              prefix={<HistoryOutlined style={{ color: '#569cd6' }} />}
              valueStyle={{ color: '#cccccc' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card
            style={{
              background: '#252526',
              border: '1px solid #3e3e42',
              textAlign: 'center',
            }}
          >
            <Statistic
              title={<span style={{ color: '#858585' }}>成功率</span>}
              value={0}
              suffix="%"
              prefix={<CheckCircleOutlined style={{ color: '#89d185' }} />}
              valueStyle={{ color: '#cccccc' }}
            />
          </Card>
        </Col>
      </Row>

      <Card
        style={{
          background: '#252526',
          border: '1px solid #3e3e42',
        }}
      >
        <Title level={4} style={{ color: '#cccccc' }}>
          主要功能
        </Title>
        <ul style={{ color: '#858585', lineHeight: 2 }}>
          <li>
            <strong style={{ color: '#cccccc' }}>TCP 连接管理</strong> - 支持多连接并发
          </li>
          <li>
            <strong style={{ color: '#cccccc' }}>自定义报文发送</strong> - 支持 Text/Hex/协议模式
          </li>
          <li>
            <strong style={{ color: '#cccccc' }}>可视化协议配置</strong> - 灵活定义协议字段
          </li>
          <li>
            <strong style={{ color: '#cccccc' }}>完整测试套件</strong> - 自动化测试和断言验证
          </li>
          <li>
            <strong style={{ color: '#cccccc' }}>历史记录管理</strong> - 追踪所有通信记录
          </li>
        </ul>
        <Paragraph style={{ color: '#858585', marginTop: 16, marginBottom: 0 }}>
          请从左侧菜单开始使用。
        </Paragraph>
      </Card>
    </div>
  );
}
