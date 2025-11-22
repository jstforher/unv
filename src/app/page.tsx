'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SideNavigation } from '@/components/ui/SideNavigation';
import { MusicToggle } from '@/components/ui/MusicToggle';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [showContent, setShowContent] = useState(false);

  const fullText = "Made for you, my universe.";

  useEffect(() => {
    setMounted(true);
    setShowContent(true);

    // Typewriter effect
    let index = 0;
    const typeInterval = setInterval(() => {
      if (index < fullText.length) {
        setTypedText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(typeInterval);
      }
    }, 100);

    return () => clearInterval(typeInterval);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background with animated gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-900">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-50 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Navigation */}
      <SideNavigation />

      {/* Music Toggle */}
      <MusicToggle />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
        <div className={`text-center space-y-8 transition-all duration-1000 transform ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>

          {/* Title with typewriter effect */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8">
            <span className="block font-mono">
              {typedText}
              <span className="animate-pulse">|</span>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-purple-200 max-w-2xl mx-auto leading-relaxed">
            A journey through our memories, floating together in a magical universe.
            Every moment we've shared is waiting to be discovered among the stars.
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12">
            <Link
              href="/universe"
              className="romantic-btn px-8 py-4 text-lg font-semibold text-white rounded-full hover:scale-105 transform transition-all duration-300 shadow-xl hover:shadow-2xl"
            >
              <span className="flex items-center gap-2">
                ✨ Enter the Universe
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>

            <Link
              href="/memories"
              className="px-8 py-4 text-lg font-semibold text-purple-200 border-2 border-purple-400/50 rounded-full hover:bg-purple-800/30 hover:border-purple-400 transform transition-all duration-300 hover:scale-105"
            >
              View Memories
            </Link>
          </div>

          {/* Navigation hint */}
          <div className="mt-16 text-purple-300/60 text-sm animate-bounce">
            <p>Use the menu in the top-left to navigate</p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-10 left-10 text-purple-300/40 text-6xl float-animation">
          💜
        </div>
        <div className="absolute top-20 right-20 text-pink-300/40 text-4xl float-animation" style={{ animationDelay: '1s' }}>
          ✨
        </div>
        <div className="absolute bottom-20 right-10 text-purple-300/40 text-5xl float-animation" style={{ animationDelay: '2s' }}>
          💫
        </div>
      </div>

      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
    </div>
  );
}
