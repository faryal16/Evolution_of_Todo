import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { isAuthenticated } from '@/lib/auth';
import LoadingSpinner from '@/components/LoadingSpinner';

const HomePage = () => {
  const router = useRouter();

  useEffect(() => {
    // Check authentication status and redirect accordingly
    if (isAuthenticated()) {
      router.push('/tasks');
    } else {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="flex justify-center items-center h-screen">
      <LoadingSpinner />
    </div>
  );
};

export default HomePage;