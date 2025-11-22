'use client';

import { useState, useEffect } from 'react';
import { UniverseScene } from '@/components/universe/UniverseScene';
import { MemoryModal } from '@/components/ui/MemoryModal';
import { SideNavigation } from '@/components/ui/SideNavigation';
import { MusicToggle } from '@/components/ui/MusicToggle';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useMemories } from '@/hooks/useMemories';
import { Memory } from '@/types/memory';

export default function UniversePage() {
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMemoryIndex, setCurrentMemoryIndex] = useState(0);

  const {
    memories,
    settings,
    loading,
    error
  } = useMemories();

  const handleMemoryClick = (memory: Memory) => {
    setSelectedMemory(memory);
    setCurrentMemoryIndex(memories.findIndex(m => m.id === memory.id));
    setIsModalOpen(true);
  };

  const handleNextMemory = () => {
    if (currentMemoryIndex < memories.length - 1) {
      const nextIndex = currentMemoryIndex + 1;
      const nextMemory = memories[nextIndex];
      setSelectedMemory(nextMemory);
      setCurrentMemoryIndex(nextIndex);
    }
  };

  const handlePreviousMemory = () => {
    if (currentMemoryIndex > 0) {
      const prevIndex = currentMemoryIndex - 1;
      const prevMemory = memories[prevIndex];
      setSelectedMemory(prevMemory);
      setCurrentMemoryIndex(prevIndex);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMemory(null);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 to-pink-900 flex items-center justify-center">
        <div className="text-center text-white p-8">
          <h1 className="text-4xl font-bold mb-4">Oops! Something went wrong</h1>
          <p className="text-xl mb-8">We couldn't load your universe right now.</p>
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
    <div className="relative w-full h-screen overflow-hidden">
      {/* 3D Universe Scene */}
      <UniverseScene
        memories={memories}
        settings={settings}
        onMemoryClick={handleMemoryClick}
        loading={loading}
      />

      {/* Navigation */}
      <SideNavigation />

      {/* Music Toggle */}
      {settings?.music_url && <MusicToggle musicUrl={settings.music_url} />}

      {/* Memory Modal */}
      {selectedMemory && (
        <MemoryModal
          memory={selectedMemory}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onNext={currentMemoryIndex < memories.length - 1 ? handleNextMemory : undefined}
          onPrevious={currentMemoryIndex > 0 ? handlePreviousMemory : undefined}
          hasNext={currentMemoryIndex < memories.length - 1}
          hasPrevious={currentMemoryIndex > 0}
        />
      )}

      {/* Universe Info Overlay */}
      <div className="absolute top-6 right-6 glass rounded-lg p-4 max-w-xs">
        <h2 className="text-white font-semibold mb-2">Your Universe</h2>
        <p className="text-purple-200 text-sm">
          {memories.length} memories floating in space
        </p>
        {memories.some(m => m.is_secret) && (
          <p className="text-pink-300 text-sm mt-1">
            ✨ {memories.filter(m => m.is_secret).length} secret memories hidden
          </p>
        )}
      </div>

      {/* Instructions for new users */}
      {memories.length > 0 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 glass rounded-lg px-6 py-3">
          <p className="text-white text-center text-sm">
            🌌 Click on any memory to explore • Drag to rotate • Scroll to zoom
          </p>
        </div>
      )}

      {/* Loading indicator */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="text-center">
            <LoadingSpinner size="large" />
            <p className="text-white mt-4">Loading your universe...</p>
          </div>
        </div>
      )}
    </div>
  );
}