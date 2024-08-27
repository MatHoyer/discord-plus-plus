import { Server } from '@prisma/client';
import Link from 'next/link';
import React from 'react';
import RoundedIcon from '../RoundedIcon';
import ServerIcon from './ServerIcon';

type TServerListProps = {
  servers: Server[];
};

const ServerList: React.FC<TServerListProps> = ({ servers }) => {
  return (
    <div className="h-full flex flex-col items-center space-y-3 bg-background p-3">
      <RoundedIcon className="discord-icon" />

      {servers.map((server) => (
        <ServerIcon server={server} key={server.id} />
      ))}

      {/* button to create a server */}
      <Link href="/server/create">Caca</Link>
    </div>
  );
};

export default ServerList;
