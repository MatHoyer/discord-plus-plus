import HomePageSidebar from '@/components/home/HomePageSidebar';

const layout = (props: LayoutParams) => {
  return (
    <div>
      <div className="hidden md:flex h-screen w-60 z-20 flex-col fixed inset-y-0">
        <HomePageSidebar />
      </div>
      <div className="md:pl-60 w-full flex flex-col h-screen">
        {props.children}
      </div>
    </div>
  );
};

export default layout;
