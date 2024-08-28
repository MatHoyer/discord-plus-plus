'use client';
import ActionTooltip from '@/components/ActionTooltip';
import RoundedIcon from '@/components/RoundedIcon';
import { useModal } from '@/hooks/useModalStore';
import { Plus } from 'lucide-react';
import React from 'react';

type TCreateServerIconProps = {};

const CreateServerItem: React.FC<TCreateServerIconProps> = () => {
  const { openModal } = useModal();

  return (
    <div>
      <ActionTooltip label="Add a server" align="center" side="right">
        <button
          className="group flex items-center"
          onClick={() => {
            openModal('createServer');
          }}
        >
          <RoundedIcon className="bg-primary/10 group-hover:bg-emerald-500">
            <Plus
              className="group-hover:text-white transition text-emerald-500"
              size={25}
            />
          </RoundedIcon>
        </button>
      </ActionTooltip>
    </div>
  );
};

export default CreateServerItem;
