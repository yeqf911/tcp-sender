import { Menu, Tooltip } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  HomeOutlined,
  ApiOutlined,
  FileTextOutlined,
  SendOutlined,
  ExperimentOutlined,
  HistoryOutlined,
} from '@ant-design/icons';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/',
      icon: (
        <Tooltip title="首页" placement="right">
          <HomeOutlined style={{ fontSize: 20 }} />
        </Tooltip>
      ),
      label: null,
    },
    {
      key: '/connections',
      icon: (
        <Tooltip title="连接管理" placement="right">
          <ApiOutlined style={{ fontSize: 20 }} />
        </Tooltip>
      ),
      label: null,
    },
    {
      key: '/protocols',
      icon: (
        <Tooltip title="协议配置" placement="right">
          <FileTextOutlined style={{ fontSize: 20 }} />
        </Tooltip>
      ),
      label: null,
    },
    {
      key: '/messages',
      icon: (
        <Tooltip title="报文发送" placement="right">
          <SendOutlined style={{ fontSize: 20 }} />
        </Tooltip>
      ),
      label: null,
    },
    {
      key: '/testing',
      icon: (
        <Tooltip title="测试套件" placement="right">
          <ExperimentOutlined style={{ fontSize: 20 }} />
        </Tooltip>
      ),
      label: null,
    },
    {
      key: '/history',
      icon: (
        <Tooltip title="历史记录" placement="right">
          <HistoryOutlined style={{ fontSize: 20 }} />
        </Tooltip>
      ),
      label: null,
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  return (
    <Menu
      mode="inline"
      selectedKeys={[location.pathname]}
      items={menuItems}
      onClick={handleMenuClick}
      theme="dark"
      style={{
        height: '100%',
        borderRight: 0,
        paddingTop: 8,
      }}
      inlineCollapsed={true}
    />
  );
}
