import { createContext, useContext, useState, ReactNode } from 'react';

const ZOOM_KEY = 'packetforge_zoom';
export const ZOOM_LEVELS = [75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130];

interface ZoomContextType {
  zoom: number;
  setZoom: (value: number) => void;
}

export const ZoomContext = createContext<ZoomContextType | undefined>(undefined);

export function ZoomProvider({ children }: { children: ReactNode }) {
  const [zoom, setZoom] = useState(() => {
    const saved = localStorage.getItem(ZOOM_KEY);
    return saved ? parseInt(saved) : 100;
  });

  const handleSetZoom = (value: number) => {
    setZoom(value);
    localStorage.setItem(ZOOM_KEY, value.toString());
  };

  return (
    <ZoomContext.Provider value={{ zoom, setZoom: handleSetZoom }}>
      {children}
    </ZoomContext.Provider>
  );
}

export const useZoom = () => {
  const context = useContext(ZoomContext);
  if (!context) throw new Error('useZoom must be used within ZoomProvider');
  return context;
};
