import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import SideBarProfile from '../profile/SideBarProfile';
import HomeHeader from './HomeHeader';
import PrivateChannelsList from './PrivateChannelsList';

const HomePageSidebar = async () => {
  const session = await auth();

  if (!session) {
    return null;
  }

  const user = session.user;

  const privateChannels = await prisma.channel.findMany({
    where: {
      type: {
        in: ['GROUP_DM', 'DM'],
      },
      participants: {
        some: {
          id: user.id,
        },
      },
    },
    include: {
      participants: true,
    },
  });

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <HomeHeader />
      <PrivateChannelsList privateChannels={privateChannels} />
      <SideBarProfile user={user} />
    </div>
  );
};

export default HomePageSidebar;
