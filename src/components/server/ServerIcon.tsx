'use client';
import { useDiscord } from '@/contexts/DiscordContext';
import { cn, getShortServerName } from '@/lib/utils';
import { Server } from '@prisma/client';
import Image from 'next/image';
import RoundedIcon from '../RoundedIcon';

const ServerIcon: React.FC<{ server: Server }> = ({ server }) => {
  const { selectedServer, selectServer, hoveredServer, setHoveredServer } =
    useDiscord();

  return (
    <div className="flex items-center">
      <div
        className={cn(
          'absolute left-0 w-1 bg-white h-10 rounded-tr-sm rounded-br-sm hidden',
          selectedServer === server.id && 'block',
          hoveredServer === server.id && 'block h-5'
        )}
      />
      <RoundedIcon
        className={selectedServer === server.id ? 'selected bg-blue-600' : ''}
        onClick={() => {
          selectServer(server.id);
        }}
        onMouseEnter={() => {
          setHoveredServer(server.id);
        }}
        onMouseLeave={() => {
          setHoveredServer(undefined);
        }}
      >
        {server.imageUrl ? (
          <Image
            src={server.imageUrl}
            width={50}
            height={50}
            alt={`${server.name} icon`}
          />
        ) : (
          <span>{getShortServerName(server.name)}</span>
        )}
      </RoundedIcon>
    </div>
  );
};

export default ServerIcon;
