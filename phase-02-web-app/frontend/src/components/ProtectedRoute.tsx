import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { isAuthenticated, checkAndRefreshToken } from '@/lib/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [status, setStatus] = useState<'checking' | 'authorized' | 'unauthorized'>('checking');
  const router = useRouter();

  useEffect(() => {
    const verify = async () => {
      const ok = await checkAndRefreshToken(); // refresh if needed
      if (!ok || !isAuthenticated()) {
        // use replace (not push) to avoid Navigation Abort
        router.replace('/login');
        setStatus('unauthorized');
        return;
      }
      setStatus('authorized');
    };
    verify();
  }, [router]);

  if (status === 'checking') {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (status === 'unauthorized') {
    return null; // won’t try to render protected content
  }

  return <>{children}</>;
};

export default ProtectedRoute;
