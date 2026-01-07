import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { isAuthenticated } from '@/lib/auth';
import Link from 'next/link';

const HomePage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication status and set loading state
    setTimeout(() => {
      if (!isAuthenticated()) {
        router.push('/login');
      }
      setIsLoading(false);
    }, 500); // Small delay to allow checking auth status
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] bg-gradient-to-br  flex flex-col">
           {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-4xl w-full bg-pink-100 rounded-2xl shadow-xl overflow-hidden">
          <div className="md:flex">
            <div className="md:flex-shrink-0 md:w-1/2 p-8 flex items-center justify-center">
              <div className="bg-pink-100 rounded-xl p-6 w-full max-w-xs">
                <div className="bg-white rounded-lg p-4 shadow-inner">
                  <div className="flex items-center mb-3">
                    <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-pink-200 rounded w-3/4"></div>
                    <div className="h-4 bg-pink-200 rounded w-full"></div>
                    <div className="h-4 bg-pink-200 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 p-8 flex flex-col justify-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Manage Your Tasks Efficiently</h2>
              <p className="text-gray-600 mb-6">
                Our intuitive Todo application helps you organize your daily tasks, set priorities, and boost productivity.
                With a clean and modern interface, staying on top of your responsibilities has never been easier.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-600">Create and manage tasks with ease</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-600">Mark tasks as completed</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-600">Filter tasks by status</p>
                </div>
              </div>
              <div className="mt-8">
                <Link
                  href="/tasks"
                  className="inline-block bg-pink-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-pink-600 transition transform hover:-translate-y-0.5"
                >
                  Go to Tasks
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

     
    </div>
  );
};

export default HomePage;