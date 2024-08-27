'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { usePathname, useRouter } from 'next/navigation';

const CreateServerModal: React.FC = () => {
  const router = useRouter();
  const path = usePathname();

  return (
    <Dialog
      open={path.startsWith('/server/create')}
      onOpenChange={(open) => {
        if (!open) {
          router.back();
        }
      }}
    >
      <DialogContent className="bg-card">
        <DialogHeader className="flex flex-col items-center justify-center gap-2">
          <DialogTitle>test</DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CreateServerModal;
