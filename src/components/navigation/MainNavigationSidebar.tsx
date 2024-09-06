import CreateServerItem from '@/features/server/create-server/CreateServerItem';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { LoginButton } from '../AuthButtons';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import PrivateMessageNavigationItem from './PrivateMessageNavigationItem';
import ServerNavigationItem from './ServerNavigationItem';

const MainNavigationSidebar = async () => {
  const session = await auth();

  const servers = await prisma.server.findMany({
    where: {
      members: {
        some: {
          userId: session?.user.id,
        },
      },
    },
  });

  return (
    <div className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22] py-3">
      <PrivateMessageNavigationItem />
      <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
      <ScrollArea className="flex-1 w-full">
        {servers.map((server) => (
          <div key={server.id} className="mb-4">
            <ServerNavigationItem server={server} />
          </div>
        ))}
      </ScrollArea>
      <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
        {session?.user ? null : <LoginButton />}
        <CreateServerItem />
      </div>
    </div>
  );
};

export default MainNavigationSidebar;
