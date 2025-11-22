import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';

interface SideNavigationProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

export const SideNavigation: React.FC<SideNavigationProps> = ({
  isOpen = false,
  onToggle
}) => {
  const router = useRouter();

  const navigationItems = [
    { href: '/', label: 'Home', icon: '🏠' },
    { href: '/universe', label: 'Universe', icon: '🌌' },
    { href: '/memories', label: 'Memories', icon: '📸' },
    { href: '/about', label: 'About', icon: '💝' },
    { href: '/admin', label: 'Admin', icon: '⚙️', requiresAuth: true }
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return router.pathname === '/';
    }
    return router.pathname.startsWith(href);
  };

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={onToggle}
        className="fixed top-6 left-6 z-40 w-12 h-12 rounded-full bg-purple-600/80 backdrop-blur-sm hover:bg-purple-700/80 transition-all duration-200 flex items-center justify-center text-white shadow-lg hover:shadow-xl transform hover:scale-105"
        aria-label="Toggle navigation"
      >
        <svg
          className={`w-6 h-6 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Navigation panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            className="fixed top-0 left-0 h-full w-72 bg-gradient-to-b from-purple-900/95 to-indigo-900/95 backdrop-blur-md z-30 border-r border-purple-500/30 shadow-2xl"
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="p-6">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">
                  Her Beautiful Universe
                </h1>
                <p className="text-purple-200/70 text-sm">
                  A journey through our memories
                </p>
              </div>

              {/* Navigation items */}
              <ul className="space-y-2">
                {navigationItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive(item.href)
                          ? 'bg-white/20 text-white shadow-lg'
                          : 'text-purple-200 hover:bg-white/10 hover:text-white'
                      }`}
                      onClick={() => onToggle?.()}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span className="font-medium">{item.label}</span>
                      {item.requiresAuth && (
                        <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Footer */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="text-center text-purple-200/50 text-sm">
                  Made with 💜
                </div>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onToggle}
          />
        )}
      </AnimatePresence>
    </>
  );
};