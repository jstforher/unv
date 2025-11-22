import { useState, useEffect, useRef, useCallback } from 'react';

interface UseAudioReturn {
  isPlaying: boolean;
  volume: number;
  toggle: () => void;
  setVolume: (volume: number) => void;
  play: () => void;
  pause: () => void;
  setTrack: (url: string) => void;
}

export const useAudio = (initialUrl?: string): UseAudioReturn => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.5);

  // Initialize audio element
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio();
      audioRef.current.loop = true;
      audioRef.current.volume = volume;

      // Set initial track if provided
      if (initialUrl) {
        audioRef.current.src = initialUrl;
      }

      // Handle audio events
      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      const handleEnded = () => setIsPlaying(false);

      const audio = audioRef.current;
      audio.addEventListener('play', handlePlay);
      audio.addEventListener('pause', handlePause);
      audio.addEventListener('ended', handleEnded);

      return () => {
        audio.removeEventListener('play', handlePlay);
        audio.removeEventListener('pause', handlePause);
        audio.removeEventListener('ended', handleEnded);
        audio.pause();
      };
    }
  }, [initialUrl]);

  const play = useCallback(async () => {
    if (audioRef.current && !isPlaying) {
      try {
        await audioRef.current.play();
      } catch (error) {
        console.warn('Audio playback failed:', error);
      }
    }
  }, [isPlaying]);

  const pause = useCallback(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const toggle = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const setVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolumeState(clampedVolume);
    if (audioRef.current) {
      audioRef.current.volume = clampedVolume;
    }
  }, []);

  const setTrack = useCallback((url: string) => {
    if (audioRef.current) {
      const wasPlaying = isPlaying;
      audioRef.current.src = url;
      if (wasPlaying) {
        play();
      }
    }
  }, [isPlaying, play]);

  return {
    isPlaying,
    volume,
    toggle,
    setVolume,
    play,
    pause,
    setTrack
  };
};