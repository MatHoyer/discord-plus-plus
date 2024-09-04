'use client';
import { getShortServerName } from '@/lib/utils';
import { Server } from '@prisma/client';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import NavigationItemWithIndicator from './NavigationItemWithIndicator';

const ServerNavigationItem: React.FC<{ server: Server }> = ({ server }) => {
  const { serverId } = useParams();
  const router = useRouter();

  return (
    <NavigationItemWithIndicator
      label={server.name}
      isSelected={serverId === server.id.toString()}
      onClick={() => {
        router.push(`/servers/${server.id}`);
      }}
      side="right"
      align="center"
      className="bg-red-500"
    >
      {server.imageUrl ? (
        <Image
          fill
          src={server.imageUrl}
          width={50}
          height={50}
          alt={`${server.name} icon`}
        />
      ) : (
        <span>{getShortServerName(server.name)}</span>
      )}
    </NavigationItemWithIndicator>
  );
};

export default ServerNavigationItem;
