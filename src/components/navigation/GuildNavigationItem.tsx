'use client';
import { getShortGuildName } from '@/lib/utils';
import { Guild } from '@prisma/client';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import NavigationItemWithIndicator from './NavigationItemWithIndicator';

const GuildNavigationItem: React.FC<{ guild: Guild }> = ({ guild }) => {
  const { guildId } = useParams();
  const router = useRouter();

  return (
    <NavigationItemWithIndicator
      label={guild.name}
      isSelected={guildId === guild.id.toString()}
      onClick={() => {
        router.push(`/channels/${guild.id}`);
      }}
      side="right"
      align="center"
      className="bg-red-500"
    >
      {guild.imageUrl ? (
        <Image
          fill
          src={guild.imageUrl}
          width={50}
          height={50}
          alt={`${guild.name} icon`}
        />
      ) : (
        <span>{getShortGuildName(guild.name)}</span>
      )}
    </NavigationItemWithIndicator>
  );
};

export default GuildNavigationItem;
