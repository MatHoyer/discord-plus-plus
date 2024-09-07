import HomePageSidebar from '@/components/home/HomePageSidebar';

const MainPage = () => {
  return (
    <div>
      <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
        <HomePageSidebar />
      </div>
      <div className="md:pl-60">tg nico le dog dog</div>
    </div>
  );
};

export default MainPage;
