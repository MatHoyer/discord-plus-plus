import { Circle } from 'lucide-react';

type MessageProps = {
  username: string;
  time: string;
  message: string;
};

const Message: React.FC<MessageProps> = ({ username, time, message }) => {
  return (
    <div className="px-5 py-1 hover:bg-gray-800 mr-3">
      <div className="flex items-start">
        <Circle size={30} fill="gray" />
        <div className="flex flex-col px-5 h-fit">
          <div className="flex items-center">
            <div className="text-gray-400">{username}</div>
            <div className="text-xs text-gray-400 pl-2">{time}</div>
          </div>
          <div className="break-all">{message}</div>
        </div>
      </div>
    </div>
  );
};

export default Message;
