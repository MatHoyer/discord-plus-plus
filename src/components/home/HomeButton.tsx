'use client';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { PropsWithChildren } from 'react';

type HomeButtonProps = {
  friendId?: number;
  isClosable?: boolean;
} & PropsWithChildren;

const HomeButton: React.FC<HomeButtonProps> = ({
  friendId,
  isClosable = false,
  children,
}) => {
  const router = useRouter();

  return (
    <div
      onClick={() => {
        if (friendId) router.push(`/conversations/${friendId}`);
      }}
      className="flex items-center bg-inherit hover:bg-[#404249] text-zinc-400 hover:text-zinc-300 transition-colors font-semibold rounded-md p-3 cursor-pointer group"
    >
      <div className="flex-1 flex gap-2">{children}</div>
      {isClosable && (
        <X
          onClick={(e) => e.stopPropagation()}
          className="hover:text-zinc-100 hidden group-hover:flex"
        />
      )}
    </div>
  );
};

export default HomeButton;
