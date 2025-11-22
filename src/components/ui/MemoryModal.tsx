import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Memory } from '../../types/memory';

interface MemoryModalProps {
  memory: Memory | null;
  isOpen: boolean;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

const MemoryModal: React.FC<MemoryModalProps> = ({
  memory,
  isOpen,
  onClose,
  onNext,
  onPrevious,
  hasNext,
  hasPrevious
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Show confetti for secret memories
  useEffect(() => {
    if (memory?.is_secret && isOpen) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [memory?.is_secret, isOpen]);

  // Reset image load state when memory changes
  useEffect(() => {
    setImageLoaded(false);
  }, [memory]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowRight':
          if (hasNext && onNext) onNext();
          break;
        case 'ArrowLeft':
          if (hasPrevious && onPrevious) onPrevious();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onNext, onPrevious, hasNext, hasPrevious]);

  if (!memory || !isOpen) return null;

  // Modal animation variants
  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 50
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
        duration: 0.4
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: {
        duration: 0.2
      }
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  // Render media based on type
  const renderMedia = () => {
    const mediaUrl = memory.media_url;

    switch (memory.media_type) {
      case 'image':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={mediaUrl}
              alt={memory.title}
              className={`max-w-full max-h-full object-contain rounded-lg transition-opacity duration-500 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
              </div>
            )}
          </div>
        );

      case 'video':
        return (
          <video
            src={mediaUrl}
            controls
            className="max-w-full max-h-full rounded-lg"
            autoPlay
          >
            Your browser does not support the video tag.
          </video>
        );

      case 'audio':
        return (
          <div className="flex flex-col items-center justify-center p-8">
            <div className="w-32 h-32 mb-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
              </svg>
            </div>
            <audio controls className="w-full max-w-md">
              <source src={mediaUrl} />
              Your browser does not support the audio element.
            </audio>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center p-8">
            <p className="text-gray-400">Unsupported media type</p>
          </div>
        );
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

        {/* Confetti for secret memories */}
        {showConfetti && <ConfettiOverlay />}

        {/* Modal content */}
        <motion.div
          className="relative bg-gradient-to-br from-purple-900/90 to-pink-900/90 backdrop-blur-md rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-purple-500/30 shadow-2xl"
          variants={modalVariants}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors flex items-center justify-center text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Navigation buttons */}
          {hasPrevious && onPrevious && (
            <button
              onClick={onPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors flex items-center justify-center text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {hasNext && onNext && (
            <button
              onClick={onNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors flex items-center justify-center text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          <div className="flex flex-col lg:flex-row h-full">
            {/* Media content */}
            <div className="flex-1 flex items-center justify-center p-8 lg:p-12 min-h-[400px]">
              {renderMedia()}
            </div>

            {/* Memory details */}
            <div className="lg:w-96 p-8 border-t lg:border-t-0 lg:border-l border-purple-500/30 bg-black/20">
              <div className="space-y-6">
                {/* Title */}
                <h2 className="text-2xl lg:text-3xl font-bold text-white">
                  {memory.title}
                  {memory.is_secret && (
                    <span className="ml-2 text-pink-400">✨</span>
                  )}
                </h2>

                {/* Category and date */}
                <div className="flex items-center space-x-4 text-white/70">
                  <span className="px-3 py-1 bg-purple-500/30 rounded-full text-sm">
                    {memory.category}
                  </span>
                  {memory.date && (
                    <span className="text-sm">
                      {new Date(memory.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  )}
                </div>

                {/* Caption */}
                <div className="text-white/90 leading-relaxed">
                  <p className="text-lg">{memory.caption}</p>
                </div>

                {/* Memory metadata */}
                <div className="pt-4 border-t border-purple-500/30 space-y-2 text-white/60 text-sm">
                  <p>Created: {new Date(memory.created_at).toLocaleDateString()}</p>
                  {memory.updated_at !== memory.created_at && (
                    <p>Updated: {new Date(memory.updated_at).toLocaleDateString()}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Confetti component for secret memory reveals
const ConfettiOverlay: React.FC = () => {
  const confettiColors = ['#9b6cff', '#ff6b8a', '#f6f7ff', '#ffd700'];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            backgroundColor: confettiColors[Math.floor(Math.random() * confettiColors.length)],
            left: `${Math.random() * 100}%`,
            top: `-20px`,
          }}
          animate={{
            y: window.innerHeight + 20,
            x: [0, Math.random() * 200 - 100],
            rotate: [0, Math.random() * 720 - 360],
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            delay: Math.random() * 0.5,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

export default MemoryModal;