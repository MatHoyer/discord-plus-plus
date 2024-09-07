import { auth } from '@/lib/auth';
import SideBarProfile from '../profile/SideBarProfile';

const HomePageSidebar = async () => {
  const session = await auth();

  if (!session) {
    return null;
  }

  const user = session.user;

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <SideBarProfile user={session.user} />
    </div>
  );
};

export default HomePageSidebar;
