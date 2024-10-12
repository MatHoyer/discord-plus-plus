'use client';

import { useModal } from '@/hooks/useModalStore';
import Image from 'next/image';
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog';

const UploadAttachmentModal: React.FC = () => {
  const { data, closeModal } = useModal();

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent
        className="bg-[#5865f2] p-5 text-white text-center pointer-events-none select-none border-dashed border-2 border-white/50 relative max-w-[310px]"
        showClose={false}
        aria-describedby={undefined}
      >
        <DialogTitle className="sr-only">Upload attachment dialog</DialogTitle>
        {data.channel ? (
          <div className="relative pointer-events-none select-none">
            <Image
              src="/assets/upload-left.svg"
              width={80}
              height={80}
              alt="left upload"
              className="-rotate-[38deg] absolute -top-20 right-[calc(50%+15px)]"
            />
            <Image
              src="/assets/upload-middle.svg"
              width={80}
              height={80}
              alt="left upload"
              className="absolute -top-[90px] right-[calc(50%-40px)] z-30"
            />
            <Image
              src="/assets/upload-right.svg"
              width={80}
              height={80}
              alt="left upload"
              className="rotate-[35deg] absolute -top-[110px] right-[calc(50%-70px)] origin-bottom-left"
            />
            <div className="mt-12">
              <h1 className="text-2xl font-bold">
                Upload to #{data.channel.name}
              </h1>
              <div className="text-xs text-white/85">
                You can add comments before uploading. Hold shift to upload
                direclty.
              </div>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default UploadAttachmentModal;
