'use client';

import { SubmitButton } from '@/components/form/SubmitButton';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import CreateServerForm from '@/features/server/create-server/CreateServerForm';
import { DialogDescription } from '@radix-ui/react-dialog';
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
      <DialogContent className="bg-background w-auto">
        <DialogHeader className="flex flex-col items-center justify-center gap-2">
          <DialogTitle>Personnalise ton serveur</DialogTitle>
          <DialogDescription className="text-muted-foreground px-12 text-center">
            Donne une personnalité à ton nouveau serveur en choisissant un nom
            et une icône. Tu pourras toujours les modifier plus tard.
          </DialogDescription>
        </DialogHeader>
        <CreateServerForm className="space-y-3">
          {(isExecuting) => (
            <DialogFooter>
              <SubmitButton loading={isExecuting}>Créer</SubmitButton>
            </DialogFooter>
          )}
        </CreateServerForm>
      </DialogContent>
    </Dialog>
  );
};

export default CreateServerModal;
