import RoundedIcon from '@/components/RoundedIcon';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

type TCreateServerIconProps = {};

const CreateServerIcon: React.FC<TCreateServerIconProps> = () => {
  return (
    <Link href="/server/create" className="self-center">
      <RoundedIcon className="group">
        <Plus className="group-hover:text-red" />
      </RoundedIcon>
    </Link>
  );
};

export default CreateServerIcon;
