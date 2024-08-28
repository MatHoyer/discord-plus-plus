import ActionTooltip from '@/components/ActionTooltip';
import RoundedIcon from '@/components/RoundedIcon';
import { Plus } from 'lucide-react';
import React from 'react';

type TCreateServerIconProps = {};

const CreateServerItem: React.FC<TCreateServerIconProps> = () => {
  return (
    <div>
      <ActionTooltip label="Add a server" align="center" side="right">
        <button className="group flex items-center">
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
