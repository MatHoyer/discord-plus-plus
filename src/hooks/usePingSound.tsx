import { useRef } from 'react';

export const useNotificationSound = () => {
  const audioRef = useRef(new Audio('/ping.mp3'));

  const play = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

  return play;
};
