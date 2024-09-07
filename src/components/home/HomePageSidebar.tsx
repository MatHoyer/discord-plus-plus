import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import SideBarProfile from '../profile/SideBarProfile';
import { ScrollArea } from '../ui/scroll-area';
import HomeButton from './HomeButton';
import HomeHeader from './HomeHeader';
import HomeUserWithActivity from './HomeUserWithActivity';

const HomePageSidebar = async () => {
  const session = await auth();

  if (!session) {
    return null;
  }

  const user = session.user;

  const friends = await prisma.user.findMany({
    where: {
      friends: {
        some: {
          id: user.id,
        },
      },
    },
  });

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <HomeHeader />
      <ScrollArea className="flex-1 px-3">
        {friends.map((friend, i) => (
          <HomeButton key={i} friendId={friend.id} isClosable>
            <HomeUserWithActivity user={friend} />
          </HomeButton>
        ))}
      </ScrollArea>
      <SideBarProfile user={user} />
    </div>
  );
};

export default HomePageSidebar;
