'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react'; // optional: use icons

export default function Header() {
  const { cart } = useCart();
  const [isLogin, setLogin] = useState(false);
  const [userName, setUserName] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (token && user) {
      setLogin(true);
      setUserName(JSON.parse(user)?.name || '');
    } else {
      onLogout();
    }
  }, []);

  const onLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-indigo-600">MeshUp</Link>

        {/* Mobile Toggle */}
        <div className="lg:hidden">
          <button className="text-black" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex space-x-6 text-gray-700 font-medium items-center">
          <Link href="/user/create-post" className="hover:text-indigo-600">Create Post</Link>
          <Link href="/user/profile" className="hover:text-indigo-600">Profile</Link>

          {!isLogin ? (
            <Link href="/login" className="hover:text-indigo-600">Login</Link>
          ) : (
            <div className="flex items-center gap-2">
              <span className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
                {userName}
              </span>
              <button onClick={onLogout} className="hover:text-indigo-600">Logout</button>
            </div>
          )}
        </nav>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
  <div className="lg:hidden flex flex-col gap-4 p-4 bg-white text-black">
    <Link href="/user/create-post" className="text-black hover:text-indigo-600">
      Create Post
    </Link>
    <Link href="/user/profile" className="text-black hover:text-indigo-600">
      Profile
    </Link>
    {!isLogin ? (
      <Link href="/login" className="text-black hover:text-indigo-600">
        Login
      </Link>
    ) : (
      <div>
        <span className="text-black text-sm mr-2">({userName})</span>
        <button onClick={onLogout} className="text-black hover:text-indigo-600">
          Logout
        </button>
      </div>
    )}
  </div>
)}

    </header>
  );
}
