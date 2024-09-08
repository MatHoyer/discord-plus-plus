import { ScrollArea } from '@/components/ui/scroll-area';
import { Handshake } from 'lucide-react';

const MeButton = () => {
  return (
    <div className="flex items-center bg-inherit hover:bg-[#404249] text-zinc-400 hover:text-zinc-300 transition-colors font-semibold rounded-md p-2 cursor-pointer group">
      <div className="flex-1 flex gap-2">
        <Handshake />
        <p>Friends</p>
      </div>
    </div>
  );
};

const MePageHeader = () => {
  return (
    <div className="w-full">
      <div className="flex border border-red-500">
        <MeButton />
      </div>
    </div>
  );
};

const Tamerlapute = () => {
  return (
    <ScrollArea className="flex-1">
      <div className="h-[1000px]">coucou</div>
      <div>je suis caché hihi 🩲🩲🩲🩲🩲🩲🩲🩲🩲🩲🩲🩲🩲🩲🩲🩲🩲🩲🩲</div>
    </ScrollArea>
  );
};

const MePage = (props: PageParams) => {
  return (
    <>
      <MePageHeader />
      <Tamerlapute />
      <div>coucou</div>
    </>
  );
};

export default MePage;
