import { Server } from '@prisma/client';
import React from 'react';
import RoundedIcon from '../RoundedIcon';
import ServerNavigationItem from '../navigation/ServerNavigationItem';

type TServerListProps = {
  servers: Server[];
};

const ServerList: React.FC<TServerListProps> = ({ servers }) => {
  return (
    <div className="h-full flex flex-col space-y-3 mt-3 bg-background relative">
      <RoundedIcon className="discord-icon self-center" />
      <div className="flex flex-col items-center space-y-4 relative">
        {servers.map((server) => (
          <ServerNavigationItem server={server} key={server.id} />
        ))}
      </div>
      {/* <CreateServerItem /> */}
    </div>
  );
};

export default ServerList;
