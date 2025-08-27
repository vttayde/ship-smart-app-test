'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

interface NavigationProps {
  currentPage?: 'home' | 'services' | 'tracking' | 'about' | 'dashboard' | 'book' | 'bookings';
}

export default function Navigation({ currentPage = 'home' }: NavigationProps) {
  const { user, logout, isAuthenticated } = useAuth();
  
  const navItems = [
    { href: '/', label: 'Home', key: 'home' },
    { href: '/book-shipment', label: 'Book Shipment', key: 'book' },
    { href: '/bookings', label: 'My Bookings', key: 'bookings' },
    { href: '/tracking', label: 'Track Package', key: 'tracking' },
    { href: '/ai-dashboard', label: '🤖 AI Dashboard', key: 'ai-dashboard' },
    { href: '/services', label: 'Services', key: 'services' },
    ...(isAuthenticated ? [{ href: '/dashboard', label: 'Dashboard', key: 'dashboard' }] : []),
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              📦 Ship Smart
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={`transition-colors ${
                  currentPage === item.key
                    ? 'text-blue-600 font-medium'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-gray-600">Welcome, {user?.firstName}</span>
                <button 
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Login
                </Link>
                <Link href="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
