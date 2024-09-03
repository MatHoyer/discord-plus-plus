import { iconMap } from '@/lib/utils';
import { Channeltype } from '@prisma/client';
import React from 'react';

type TChannelHeaderProps = {
  name: string;
  channelType: Channeltype;
};

const ChannelHeader: React.FC<TChannelHeaderProps> = ({
  name,
  channelType,
}) => {
  const Icon = iconMap[channelType];
  return (
    <div className="text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2">
      <Icon className="h-5 w-5 text-zinc-500 dark:text-zinc-400 mr-2" />
      <p className="font-semibold text-md text-black dark:text-white">{name}</p>
    </div>
  );
};

export default ChannelHeader;
