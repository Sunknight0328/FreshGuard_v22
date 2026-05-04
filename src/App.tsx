import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { RequireAuth } from '@/components/auth/RequireAuth';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/common/Header';
import BottomNav from '@/components/layout/BottomNav';
import LanguageSelector from '@/components/LanguageSelector';
import { LanguageProvider, useLanguageContext } from '@/contexts/LanguageContext';
import routes from './routes';
import '@/i18n';

const AppContent = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <>
      <Toaster />
      <RequireAuth whiteList={['/login']}>
        <div className="flex flex-col min-h-screen">
          {!isLoginPage && <Header />}
          <main className="flex-grow">
            <Routes>
              {routes.map((route, index) => (
                <Route
                  key={index}
                  path={route.path}
                  element={route.element}
                />
              ))}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          {!isLoginPage && <BottomNav />}
        </div>
      </RequireAuth>
    </>
  );
};

const AppWithLanguage = () => {
  const { languageSelected, setLanguageSelected } = useLanguageContext();

  const handleLanguageSelected = () => {
    setLanguageSelected(true);
  };

  // 如果用户还没有选择语言，显示语言选择界面
  if (!languageSelected) {
    return <LanguageSelector onLanguageSelected={handleLanguageSelected} />;
  }

  // 用户已选择语言，显示正常应用界面
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

const App = () => {
  return (
    <LanguageProvider>
      <AppWithLanguage />
    </LanguageProvider>
  );
};

export default App;
