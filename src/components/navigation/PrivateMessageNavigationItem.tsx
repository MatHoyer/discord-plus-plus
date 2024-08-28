'use client';
import React from 'react';
import NavigationItemWithIndicator from './NavigationItemWithIndicator';

interface PrivateMessageNavigationItemProps {}

const PrivateMessageNavigationItem: React.FC<
  PrivateMessageNavigationItemProps
> = () => {
  return (
    <NavigationItemWithIndicator
      isSelected
      label="Private messages"
      onClick={() => {}}
      side="right"
      align="center"
    >
      <span>PM</span>
    </NavigationItemWithIndicator>
  );
};

export default PrivateMessageNavigationItem;
