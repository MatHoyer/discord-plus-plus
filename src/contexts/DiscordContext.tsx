'use client';
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
} from 'react';

type TDiscordContext = {
  selectedServer: number | undefined;
  selectedChannel: number | undefined;
  hoveredServer: number | undefined;
  selectServer: (serverId: number | undefined) => void;
  selectChannel: (channelId: number) => void;
  setHoveredServer: (serverId: number | undefined) => void;
};

const DiscordContext = createContext<TDiscordContext | undefined>(undefined);

export const DiscordProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [selectedServer, setSelectedServer] = useState<number | undefined>(
    undefined
  );
  const [selectedChannel, setSelectedChannel] = useState<number | undefined>(
    undefined
  );

  const [hoveredServer, setHoveredServer] = useState<number | undefined>(
    undefined
  );

  const selectServer = (serverId: number | undefined) => {
    setSelectedServer(serverId);
    setSelectedChannel(undefined);
  };

  const selectChannel = (channelId: number) => {
    setSelectedChannel(channelId);
  };

  return (
    <DiscordContext.Provider
      value={{
        selectedServer,
        selectedChannel,
        hoveredServer,
        selectChannel,
        selectServer,
        setHoveredServer,
      }}
    >
      {children}
    </DiscordContext.Provider>
  );
};

export const useDiscord = () => {
  const context = useContext(DiscordContext);
  if (context === undefined) {
    throw new Error('useDiscord must be used within a DiscordProvider');
  }
  return context;
};
