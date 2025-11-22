'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SideNavigation } from '@/components/ui/SideNavigation';
import { MusicToggle } from '@/components/ui/MusicToggle';

export default function AboutPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-900">
      {/* Navigation */}
      <SideNavigation />

      {/* Music Toggle */}
      <MusicToggle />

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 text-gradient">
              Our Beautiful Universe
            </h1>
            <p className="text-xl text-purple-200 leading-relaxed">
              This is more than just a collection of photos—it's a celebration of our journey together.
              Every memory we've shared is a star in our personal universe, illuminating the path we've walked
              and the adventures that await us.
            </p>
          </div>

          {/* Story Section */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Our Story</h2>
              <div className="space-y-4 text-purple-200">
                <p>
                  Every relationship is a universe of its own—filled with moments that sparkle like stars,
                  adventures that take us to new galaxies, and quiet moments that shine with gentle light.
                </p>
                <p>
                  This digital universe is my way of capturing the magic we've created together.
                  Each floating memory represents not just an image or video, but the emotion, the laughter,
                  and the love that fills those moments.
                </p>
                <p>
                  From our first date that felt like destiny, to the quiet mornings with coffee,
                  to the adventures that took us around corners and into new experiences—
                  every memory is a precious gem in our collection.
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className="text-8xl mb-4 float-animation">💝</div>
              <div className="glass rounded-lg p-6 text-purple-200">
                <p className="font-semibold mb-2">"Forever isn't long enough"</p>
                <p className="text-sm">to spend with you</p>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Features</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="glass rounded-lg p-6 text-center">
                <div className="text-4xl mb-4">🌌</div>
                <h3 className="text-xl font-semibold text-white mb-2">3D Universe</h3>
                <p className="text-purple-200">
                  Explore our memories in an immersive 3D space where every moment floats like a star.
                </p>
              </div>
              <div className="glass rounded-lg p-6 text-center">
                <div className="text-4xl mb-4">💝</div>
                <h3 className="text-xl font-semibold text-white mb-2">Secret Memories</h3>
                <p className="text-purple-200">
                  Hidden treasures waiting to be discovered—special messages just for you.
                </p>
              </div>
              <div className="glass rounded-lg p-6 text-center">
                <div className="text-4xl mb-4">🎵</div>
                <h3 className="text-xl font-semibold text-white mb-2">Our Soundtrack</h3>
                <p className="text-purple-200">
                  Background music that captures the feeling of our journey together.
                </p>
              </div>
            </div>
          </div>

          {/* Technical Details */}
          <div className="glass rounded-lg p-8 mb-16">
            <h2 className="text-2xl font-bold text-white mb-6">Built With Love</h2>
            <div className="grid md:grid-cols-2 gap-8 text-purple-200">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Frontend Magic</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Next.js 16 with React 19</li>
                  <li>• Three.js for 3D graphics</li>
                  <li>• Framer Motion for animations</li>
                  <li>• Tailwind CSS for styling</li>
                  <li>• TypeScript for reliability</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Backend Foundation</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Django 5 with Django REST Framework</li>
                  <li>• PostgreSQL for data storage</li>
                  <li>• Token-based authentication</li>
                  <li>• Docker for deployment</li>
                  <li>• Secure file uploads</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Our Journey</h2>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-purple-400 to-pink-400"></div>

              {/* Timeline events */}
              <div className="space-y-12">
                <div className="flex items-center">
                  <div className="flex-1 text-right pr-8">
                    <div className="glass rounded-lg p-4 inline-block text-left">
                      <h3 className="font-semibold text-white">The Beginning</h3>
                      <p className="text-purple-200 text-sm">Where it all started</p>
                    </div>
                  </div>
                  <div className="w-4 h-4 bg-purple-400 rounded-full z-10"></div>
                  <div className="flex-1 pl-8"></div>
                </div>

                <div className="flex items-center">
                  <div className="flex-1 pr-8"></div>
                  <div className="w-4 h-4 bg-pink-400 rounded-full z-10"></div>
                  <div className="flex-1 text-left pl-8">
                    <div className="glass rounded-lg p-4 inline-block">
                      <h3 className="font-semibold text-white">First Adventure</h3>
                      <p className="text-purple-200 text-sm">Making memories together</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="flex-1 text-right pr-8">
                    <div className="glass rounded-lg p-4 inline-block text-left">
                      <h3 className="font-semibold text-white">Growing Together</h3>
                      <p className="text-purple-200 text-sm">Building our universe</p>
                    </div>
                  </div>
                  <div className="w-4 h-4 bg-purple-400 rounded-full z-10"></div>
                  <div className="flex-1 pl-8"></div>
                </div>

                <div className="flex items-center">
                  <div className="flex-1 pr-8"></div>
                  <div className="w-4 h-4 bg-pink-400 rounded-full z-10"></div>
                  <div className="flex-1 text-left pl-8">
                    <div className="glass rounded-lg p-4 inline-block">
                      <h3 className="font-semibold text-white">Forever & Always</h3>
                      <p className="text-purple-200 text-sm">Our journey continues...</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Ready to Explore?</h2>
            <p className="text-purple-200 mb-8 max-w-2xl mx-auto">
              Our universe is waiting for you. Click below to start exploring the memories we've created together.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                href="/universe"
                className="romantic-btn px-8 py-4 text-lg font-semibold text-white rounded-full hover:scale-105 transform transition-all duration-300"
              >
                🌌 Enter Our Universe
              </Link>
              <Link
                href="/memories"
                className="px-8 py-4 text-lg font-semibold text-purple-200 border-2 border-purple-400/50 rounded-full hover:bg-purple-800/30 hover:border-purple-400 transform transition-all duration-300 hover:scale-105"
              >
                📸 Browse All Memories
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}