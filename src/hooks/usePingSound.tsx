'use client';
import { useEffect, useRef } from 'react';

export const useNotificationSound = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio('/ping.mp3');
    }
  }, []);

  const play = () => {
    if (audioRef.current) {
      console.log('calling audio ref', audioRef.current);
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

  return play;
};
