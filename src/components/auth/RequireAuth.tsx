import { useEffect, type ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';

interface RequireAuthProps {
  children: ReactNode;
  whiteList?: string[];
}

export function RequireAuth({ children, whiteList = [] }: RequireAuthProps) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      // 检查当前路径是否在白名单中
      const isWhitelisted = whiteList.some(path => {
        if (path.endsWith('/*')) {
          const basePath = path.slice(0, -2);
          return location.pathname.startsWith(basePath);
        }
        return location.pathname === path;
      });

      if (!isWhitelisted) {
        navigate('/login', { replace: true, state: { from: location } });
      }
    }
  }, [user, loading, navigate, location, whiteList]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">加载中...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
