import { CirclePlus } from 'lucide-react';
import { Input } from './ui/input';

const ChatInput: React.FC<{ channel: string }> = ({ channel }) => {
  return (
    <div className="flex items-center gap-2 rounded-md p-1 bg-gray-500">
      <CirclePlus size={30} className="cursor-pointer" />
      <Input
        className="border-none bg-inherit focus-visible:ring-0 focus-visible:ring-offset-0 select-none"
        placeholder={`Envoyer un message dans #${channel}`}
      />
    </div>
  );
};

export default ChatInput;
