import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { isAuthenticated, isTokenExpired, checkAndRefreshToken } from '@/lib/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      // Check if token needs refresh and refresh if needed
      const refreshed = await checkAndRefreshToken();
      if (!refreshed) {
        // If refresh failed, redirect to login
        router.push('/login');
        return;
      }

      // Check if user is authenticated
      if (!isAuthenticated()) {
        router.push('/login');
        return;
      }

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

  return <>{children}</>;
};

export default ProtectedRoute;