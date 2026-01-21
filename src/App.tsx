import { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import enUS from 'antd/locale/en_US';
import { ZoomProvider, useZoom } from './contexts/ZoomContext';
import { FontSizeProvider, useFontSize } from './contexts/FontSizeContext';
import MainLayout from './components/Layout/MainLayout';
import './App.css';

function AppContent() {
  const { zoom } = useZoom();
  const { fontSize } = useFontSize();

  useEffect(() => {
    // Apply zoom to body element
    document.body.style.zoom = `${zoom}%`;

    // When zoom < 100%, we need larger container to fill viewport after shrinking
    // When zoom > 100%, we need smaller container to fit viewport after expanding
    const zoomFactor = zoom / 100;

    // Calculate the height needed BEFORE zoom to get viewport height AFTER zoom
    // Formula: needed_height = viewport_height / zoomFactor
    const viewportHeight = window.innerHeight;
    const neededHeight = viewportHeight / zoomFactor;

    document.documentElement.style.setProperty('--vh', `${neededHeight}px`);
    document.documentElement.style.setProperty('--zoom-factor', zoomFactor.toString());

    // Also adjust #root height directly using vh unit
    const root = document.getElementById('root');
    if (root) {
      root.style.height = `${100 / zoomFactor}vh`;
    }
  }, [zoom]);

  useEffect(() => {
    // Update --vh on resize
    const handleResize = () => {
      const zoomFactor = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--zoom-factor') || '1');
      const viewportHeight = window.innerHeight;
      const neededHeight = viewportHeight / zoomFactor;
      document.documentElement.style.setProperty('--vh', `${neededHeight}px`);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <ConfigProvider
      locale={enUS}
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#ff6c37',
          colorBgContainer: '#1e1e1e',
          colorBgElevated: '#252526',
          borderRadius: 2,
          fontSize,
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
          Input: {
            colorBgContainer: '#1e1e1e',
            colorBorder: '#1e1e1e',
            borderRadius: 2,
          },
          InputNumber: {
            colorBgContainer: '#1e1e1e',
            colorBorder: '#1e1e1e',
            borderRadius: 2,
          },
          Select: {
            colorBgContainer: '#1e1e1e',
            colorBorder: '#1e1e1e',
            borderRadius: 2,
            optionSelectedBg: '#37373d',
          },
          Button: {
            colorBorder: 'transparent',
            colorPrimary: '#ff6c37',
            colorPrimaryHover: '#ff7c52',
            colorPrimaryActive: '#e55a2a',
            defaultBg: '#3e3e42',
            defaultBorderColor: '#3e3e42',
            defaultColor: '#cccccc',
            borderRadius: 2,
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

function App() {
  return (
    <FontSizeProvider>
      <ZoomProvider>
        <AppContent />
      </ZoomProvider>
    </FontSizeProvider>
  );
}

export default App;
