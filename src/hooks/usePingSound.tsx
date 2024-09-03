'use client';
import { useEffect, useRef } from 'react';

export const useNotificationSound = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isAllowedToPlayRef = useRef(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio('/ping.mp3');

      const enableAudioPlayback = () => {
        isAllowedToPlayRef.current = true;
      };

      document.addEventListener('click', enableAudioPlayback);
      document.addEventListener('keydown', enableAudioPlayback);

      return () => {
        document.removeEventListener('click', enableAudioPlayback);
        document.removeEventListener('keydown', enableAudioPlayback);
      };
    }
  }, []);

  const play = () => {
    if (isAllowedToPlayRef.current && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

  return play;
};
