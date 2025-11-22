'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MemoryModal } from '@/components/ui/MemoryModal';
import { SideNavigation } from '@/components/ui/SideNavigation';
import { MusicToggle } from '@/components/ui/MusicToggle';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useMemories } from '@/hooks/useMemories';
import { Memory } from '@/types/memory';

export default function MemoriesPage() {
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMemoryIndex, setCurrentMemoryIndex] = useState(0);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const {
    memories,
    featuredMemories,
    loading,
    error,
    loadMoreMemories,
    hasMore
  } = useMemories();

  const filteredMemories = memories.filter(memory => {
    const matchesFilter = filter === 'all' || memory.category === filter;
    const matchesSearch = memory.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         memory.caption.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleMemoryClick = (memory: Memory, index: number) => {
    setSelectedMemory(memory);
    setCurrentMemoryIndex(index);
    setIsModalOpen(true);
  };

  const handleNextMemory = () => {
    if (currentMemoryIndex < filteredMemories.length - 1) {
      const nextIndex = currentMemoryIndex + 1;
      const nextMemory = filteredMemories[nextIndex];
      setSelectedMemory(nextMemory);
      setCurrentMemoryIndex(nextIndex);
    }
  };

  const handlePreviousMemory = () => {
    if (currentMemoryIndex > 0) {
      const prevIndex = currentMemoryIndex - 1;
      const prevMemory = filteredMemories[prevIndex];
      setSelectedMemory(prevMemory);
      setCurrentMemoryIndex(prevIndex);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMemory(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 to-pink-900 flex items-center justify-center">
        <div className="text-center text-white p-8">
          <h1 className="text-4xl font-bold mb-4">Oops! Something went wrong</h1>
          <p className="text-xl mb-8">We couldn't load your memories right now.</p>
          <button
            onClick={() => window.location.reload()}
            className="romantic-btn px-6 py-3 rounded-lg text-white font-semibold"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-900">
      {/* Navigation */}
      <SideNavigation />

      {/* Music Toggle */}
      <MusicToggle />

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-gradient">
            Our Memories
          </h1>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto">
            A collection of all our beautiful moments together. Click on any memory to see the details.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search memories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-purple-400/30 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 glass"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2">
            {['all', 'milestone', 'trip', 'party', 'random'].map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-4 py-2 rounded-lg capitalize transition-all ${
                  filter === category
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/10 text-purple-200 hover:bg-white/20 glass'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Memories */}
        {featuredMemories.length > 0 && filter === 'all' && !searchTerm && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              ⭐ Featured Memories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredMemories.map((memory, index) => (
                <MemoryCard
                  key={memory.id}
                  memory={memory}
                  onClick={() => handleMemoryClick(memory, memories.indexOf(memory))}
                />
              ))}
            </div>
          </div>
        )}

        {/* All Memories */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">
            {filter === 'all' ? 'All Memories' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Memories`}
            {filteredMemories.length > 0 && (
              <span className="text-purple-300 text-lg font-normal ml-2">
                ({filteredMemories.length})
              </span>
            )}
          </h2>

          {filteredMemories.length === 0 && !loading ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-xl text-purple-200">
                No memories found matching your criteria.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredMemories.map((memory, index) => (
                <MemoryCard
                  key={memory.id}
                  memory={memory}
                  onClick={() => handleMemoryClick(memory, index)}
                />
              ))}
            </div>
          )}

          {/* Load More Button */}
          {hasMore && filteredMemories.length === memories.length && (
            <div className="text-center mt-12">
              <button
                onClick={loadMoreMemories}
                disabled={loading}
                className="romantic-btn px-8 py-3 rounded-lg text-white font-semibold disabled:opacity-50"
              >
                {loading ? <LoadingSpinner size="small" /> : 'Load More Memories'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Memory Modal */}
      {selectedMemory && (
        <MemoryModal
          memory={selectedMemory}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onNext={currentMemoryIndex < filteredMemories.length - 1 ? handleNextMemory : undefined}
          onPrevious={currentMemoryIndex > 0 ? handlePreviousMemory : undefined}
          hasNext={currentMemoryIndex < filteredMemories.length - 1}
          hasPrevious={currentMemoryIndex > 0}
        />
      )}
    </div>
  );
}

// Memory Card Component
interface MemoryCardProps {
  memory: Memory;
  onClick: () => void;
}

const MemoryCard: React.FC<MemoryCardProps> = ({ memory, onClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
    >
      <div className="glass rounded-lg overflow-hidden hover:shadow-2xl">
        {/* Image Container */}
        <div className="aspect-square relative overflow-hidden">
          {memory.is_secret ? (
            <div className="w-full h-full bg-gradient-to-br from-pink-600 to-purple-600 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-4xl mb-2">💝</div>
                <p className="font-semibold">Secret Memory</p>
                <p className="text-sm opacity-75">Click to reveal</p>
              </div>
            </div>
          ) : (
            <>
              <img
                src={memory.thumbnail_url}
                alt={memory.title}
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
              />
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-purple-900/50">
                  <LoadingSpinner />
                </div>
              )}
            </>
          )}

          {/* Category Badge */}
          <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 rounded-full text-xs text-white">
            {memory.category}
          </div>

          {/* Featured Badge */}
          {memory.is_featured && (
            <div className="absolute top-2 left-2 px-2 py-1 bg-yellow-500 rounded-full text-xs text-black">
              ⭐ Featured
            </div>
          )}
        </div>

        {/* Memory Info */}
        <div className="p-4">
          <h3 className="font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">
            {memory.title}
          </h3>
          <p className="text-purple-200 text-sm line-clamp-3 mb-3">
            {memory.caption}
          </p>
          {memory.date && (
            <p className="text-purple-300 text-xs">
              {new Date(memory.date).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};