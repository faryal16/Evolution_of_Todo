import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { authAPI } from '@/services/api';
import { setAuthData } from '@/lib/auth';
import LoadingSpinner from '@/components/LoadingSpinner';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await authAPI.login({
        email,
        password
      });

      // Store auth data
      setAuthData(response.token, response.user, response.expiresAt);

      // Redirect to home page
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br  p-4">
      <div className="w-full max-w-md bg-pink-100 rounded-2xl shadow-xl overflow-hidden border-t-4 border-pink-400">
        <div className="p-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Sign in to your account
            </h2>
            <p className="text-gray-500 mb-6">Welcome back! Please login to continue.</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent transition"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent transition"
              />
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-pink-600 transition duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 flex justify-center items-center"
            >
              {loading ? <LoadingSpinner size="sm" className="text-white" /> : 'Sign in'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Don't have an account?{' '}
              <Link href="/signup" className="font-medium text-pink-600 hover:text-pink-800">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
