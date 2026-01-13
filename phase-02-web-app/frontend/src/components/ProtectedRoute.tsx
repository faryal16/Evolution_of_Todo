import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { isAuthenticated, checkAndRefreshToken } from '@/lib/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const refreshed = await checkAndRefreshToken();
      if (!refreshed || !isAuthenticated()) {
        router.replace('/login'); // use replace instead of push
        return;
      }
      setAllowed(true);
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return <>{allowed && children}</>;
};

export default ProtectedRoute;
