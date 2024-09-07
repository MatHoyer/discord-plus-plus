import ActionTooltip from '@/components/ActionTooltip';
import { ServerMessageAttachment } from '@prisma/client';
import { Trash2 } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

type TMessageAttachmentsProps = {
  message: ServerMessageWithSender;
  Wrapper: React.ReactElement;
  preview?: boolean;
  onDeleteAttachment?: (attachment: ServerMessageAttachment) => void;
  isOwner?: boolean;
};

const MessageAttachments: React.FC<TMessageAttachmentsProps> = ({
  message,
  Wrapper,
  preview,
  onDeleteAttachment,
  isOwner,
}) => {
  return (
    (message?.attachments?.length || 0) > 0 && (
      <div className="flex flex-row items-center gap-4">
        {message.attachments?.map((attachment) => (
          <div key={attachment.id} className="relative group/attachment">
            {React.cloneElement(
              Wrapper,
              { attachment },
              <Image
                src={attachment.url}
                width={0}
                height={0}
                alt="attachment"
                sizes="100vw"
                className="rounded-md cursor-pointer w-full h-auto"
              />
            )}
            {!preview && isOwner && (
              <ActionTooltip label="Delete">
                <button
                  style={{
                    boxShadow: '0 0 5px #242628',
                  }}
                  className="group/attachment-inside group-hover/attachment:flex hidden absolute right-0 top-2 cursor-pointer bg-[#313338] hover:bg-red-500 hover:border-red-500 p-1 rounded-md transition-colors border-[#303136] border-[1px]"
                  onClick={() => {
                    onDeleteAttachment?.(attachment);
                  }}
                >
                  <Trash2 className="w-5 h-5 text-zinc-400 group-hover/attachment-inside:text-zinc-200 transition-colors" />
                </button>
              </ActionTooltip>
            )}
          </div>
        ))}
      </div>
    )
  );
};

export default MessageAttachments;
