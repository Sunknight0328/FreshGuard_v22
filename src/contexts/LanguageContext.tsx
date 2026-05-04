import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface LanguageContextType {
  languageSelected: boolean;
  resetLanguageSelection: () => void;
  setLanguageSelected: (selected: boolean) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguageContext = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguageContext must be used within LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const { i18n } = useTranslation();
  const [languageSelected, setLanguageSelected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // 检查用户是否已经选择过语言
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
      setLanguageSelected(true);
    }
    setIsLoading(false);
  }, [i18n]);

  const resetLanguageSelection = () => {
    // 清除 localStorage 中的语言设置
    localStorage.removeItem('language');
    // 重置语言选择状态
    setLanguageSelected(false);
  };

  if (isLoading) {
    return null;
  }

  return (
    <LanguageContext.Provider
      value={{
        languageSelected,
        resetLanguageSelection,
        setLanguageSelected,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
