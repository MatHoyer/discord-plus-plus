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
    // <ActionTooltip label={server.name} side="right" align="center">
    //   <button
    //     onClick={() => {
    //       router.push(`/servers/${server.id}`);
    //     }}
    //     className="group relative flex items-center"
    //   >
    //     <div
    //       className={cn(
    //         'absolute left-0 bg-primary rounded-r-full transition-all w-[4px]',
    //         serverId !== server.id.toString() && 'group-hover:h-[20px]',
    //         serverId === server.id.toString() ? 'h-[36px]' : 'h-[8px]'
    //       )}
    //     />
    //     <RoundedIcon
    //       className={cn(
    //         'bg-red-500',
    //         serverId === server.id.toString() &&
    //           'bg-primary/10 text-primary rounded-[16px]'
    //       )}
    //     >

    //     </RoundedIcon>
    //   </button>
    //   {/* <div className="flex items-center">
    //     <div
    //       className={cn(
    //         'absolute left-0 w-1 bg-white h-10 rounded-tr-sm rounded-br-sm hidden transition-all duration-300'
    //       )}
    //     />
    //     <RoundedIcon
    //     // className={selectedServer === server.id ? 'selected bg-blue-600' : ''}
    //     // onClick={() => {
    //     //   selectServer(server.id);
    //     // }}
    //     // onMouseEnter={() => {
    //     //   setHoveredServer(server.id);
    //     // }}
    //     // onMouseLeave={() => {
    //     //   setHoveredServer(undefined);
    //     // }}
    //     >

    //     </RoundedIcon>
    //   </div> */}
    // </ActionTooltip>
  );
};

export default ServerNavigationItem;
