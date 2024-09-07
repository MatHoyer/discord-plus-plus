import { auth } from '@/lib/auth';
import SideBarProfile from '../profile/SideBarProfile';
import { ScrollArea } from '../ui/scroll-area';
import HomeHeader from './HomeHeader';

const HomePageSidebar = async () => {
  const session = await auth();

  if (!session) {
    return null;
  }

  const user = session.user;

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <HomeHeader />
      <ScrollArea className="flex-1 px-3"></ScrollArea>
      <SideBarProfile user={session.user} />
    </div>
  );
};

export default HomePageSidebar;
