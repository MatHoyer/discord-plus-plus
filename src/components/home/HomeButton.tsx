import { X } from 'lucide-react';
import { PropsWithChildren } from 'react';

type HomeButtonProps = {
  onClick?: () => void;
  isClosable?: boolean;
} & PropsWithChildren;

const HomeButton: React.FC<HomeButtonProps> = ({
  onClick,
  isClosable = false,
  children,
}) => {
  return (
    <div className="flex bg-inherit hover:bg-[#404249] text-zinc-400 hover:text-zinc-300 transition-colors font-semibold rounded-md p-3 cursor-pointer">
      <div className="flex-1 flex gap-2">{children}</div>
      {isClosable && <X className="hover:text-zinc-100" />}
    </div>
  );
};

export default HomeButton;
