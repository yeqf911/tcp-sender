import { BrowserRouter as Router } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import MainLayout from './components/Layout/MainLayout';
import './App.css';

function App() {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#ff6c37',
          colorBgContainer: '#1e1e1e',
          colorBgElevated: '#252526',
          borderRadius: 4,
          fontSize: 13,
        },
        components: {
          Layout: {
            headerBg: '#252526',
            siderBg: '#2d2d30',
            bodyBg: '#1e1e1e',
          },
          Menu: {
            darkItemBg: '#2d2d30',
            darkItemSelectedBg: '#37373d',
            darkItemHoverBg: '#37373d',
          },
        },
      }}
    >
      <Router>
        <MainLayout />
      </Router>
    </ConfigProvider>
  );
}

export default App;
