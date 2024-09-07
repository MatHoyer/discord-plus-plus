'use client';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import NavigationItemWithIndicator from './NavigationItemWithIndicator';

interface PrivateMessageNavigationItemProps {}

const PrivateMessageNavigationItem: React.FC<
  PrivateMessageNavigationItemProps
> = () => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <NavigationItemWithIndicator
      isSelected={pathname === '/'}
      label="Private messages"
      onClick={() => {
        router.push('/conversations');
      }}
      side="right"
      align="center"
      className="bg-[#8491e8]"
    >
      <Image
        className="bg-cover"
        src="https://cdn.logojoy.com/wp-content/uploads/20210422095037/discord-mascot.png"
        alt="Discord icon"
        width={48}
        height={48}
      />
    </NavigationItemWithIndicator>
  );
};

export default PrivateMessageNavigationItem;
