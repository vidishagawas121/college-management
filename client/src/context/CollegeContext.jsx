import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { collegeService } from '../services/collegeService';
import { settingsService } from '../services/settingsService';
import { menuService } from '../services/menuService';

const CollegeContext = createContext(null);

export const CollegeProvider = ({ children }) => {
  const [collegeInfo, setCollegeInfo] = useState(null);
  const [settings, setSettings] = useState(null);
  const [navigationMenu, setNavigationMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGlobalData = useCallback(async () => {
    try {
      const [collegeRes, settingsRes, menuRes] = await Promise.all([
        collegeService.getCollegeInfo().catch(() => ({ data: null })),
        settingsService.getSettings().catch(() => ({ data: null })),
        menuService.getNavigationMenu().catch(() => ({ data: [] })),
      ]);

      if (collegeRes.data) setCollegeInfo(collegeRes.data);
      if (settingsRes.data) setSettings(settingsRes.data);
      if (menuRes.data) setNavigationMenu(menuRes.data);
    } catch (err) {
      console.error('Failed to load global college context:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGlobalData();
  }, [fetchGlobalData]);

  const refreshGlobalData = async () => {
    await fetchGlobalData();
  };

  return (
    <CollegeContext.Provider
      value={{
        collegeInfo,
        settings,
        navigationMenu,
        loading,
        refreshGlobalData,
      }}
    >
      {children}
    </CollegeContext.Provider>
  );
};

export const useCollege = () => {
  const context = useContext(CollegeContext);
  if (!context) {
    throw new Error('useCollege must be used within a CollegeProvider');
  }
  return context;
};
