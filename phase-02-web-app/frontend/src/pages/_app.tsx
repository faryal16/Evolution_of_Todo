import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Inter } from 'next/font/google';
import Head from 'next/head';

const inter = Inter({ subsets: ['latin'] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Todo App</title>
        <meta name="description" content="Next.js + Tailwind Todo App" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-[60vh] flex flex-col bg-gradient-to-br from-purple-200 via-pink-200 to-yellow-200 font-sans">

        {/* Header */}
        <header className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg">
          <div className="max-w-7xl mx-auto p-4 flex justify-between items-center">
            <h1 className="text-xl font-bold">Todo App</h1>
            <nav className="space-x-4">
              <a href="/" className="hover:underline hover:text-yellow-200 transition-colors">Home</a>
              <a href="/tasks" className="hover:underline hover:text-yellow-200 transition-colors">Tasks</a>
              <a href="/login" className="hover:underline hover:text-yellow-200 transition-colors">Login</a>
              <a href="/signup" className="hover:underline hover:text-yellow-200 transition-colors">Sign Up</a>
            </nav>
          </div>
        </header>

        {/* Main Content — Full width/height, no extra wrapper */}
        <main className={`${inter.className} flex-1  w-full p-6`}>
          <Component {...pageProps} />
        </main>

        {/* Footer */}
        <footer className="mt-12 py-4 text-center text-gray-700 border-t border-gray-300">
          © 2026 Todo App. All rights reserved.
        </footer>
      </div>
    </>
  );
}
