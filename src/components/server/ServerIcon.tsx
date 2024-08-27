import { getShortServerName } from '@/lib/utils';
import Image from 'next/image';
import RoundedIcon from '../RoundedIcon';

const ServerIcon: React.FC<{ server: any }> = ({ server }) => {
  return (
    <RoundedIcon>
      {server.imageUrl ? (
        <Image src={server.imageUrl} width={50} height={50} alt={`${server.name} icon`} />
      ) : (
        <span>{getShortServerName(server.name)}</span>
      )}
    </RoundedIcon>
  );
};
export default ServerIcon;
