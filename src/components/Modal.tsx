'use client';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { DialogFooter, DialogHeader } from './ui/dialog';
import { Label } from './ui/label';

export const modal: IModal = {
  question: (_params: IQuestionParams) => Promise.resolve(false),
  error: (_params: IMessageParams) => Promise.resolve(false),
  info: (_params: IMessageParams) => Promise.resolve(false),
};

const Modal: React.FC = () => {
  const [open, setOpen] = useState({
    question: false,
    message: false,
  });
  const [modalMessageParams, setModalMessageParams] = useState<IMessageModalProps>();
  const [modalQuestionParams, setModalQuestionParams] = useState<IQuestionModalProps>();

  useEffect(() => {
    modal.question = (params: IQuestionParams) => {
      setOpen((prev) => ({ ...prev, question: true }));
      const resp = new Promise<boolean>((resolve) => {
        setModalQuestionParams({
          title: params.title || 'Confirmer cette action',
          message: params.message || '',
          doubleConfirm: params.doubleConfirm,
          closeModal: (value: boolean) => {
            resolve(value);
            setOpen((prev) => ({ ...prev, question: false }));
            setTimeout(() => setModalQuestionParams(undefined), 50);
          },
        });
      });
      return resp;
    };

    modal.error = (params: IMessageParams) => {
      setOpen((prev) => ({ ...prev, message: true }));
      const resp = new Promise<boolean>((resolve) => {
        setModalMessageParams({
          title: params.title || 'Erreur',
          message: params.message || '',
          messageType: 'error',
          closeModal: () => {
            resolve(true);
            setOpen((prev) => ({ ...prev, message: false }));
            setTimeout(() => setModalMessageParams(undefined), 50);
          },
        });
      });
      return resp;
    };

    modal.info = (params: IMessageParams) => {
      setOpen((prev) => ({ ...prev, message: true }));
      const resp = new Promise<boolean>((resolve) => {
        setModalMessageParams({
          title: params.title || 'Information',
          message: params.message || '',
          messageType: 'info',
          closeModal: () => {
            resolve(true);
            setOpen((prev) => ({ ...prev, message: false }));
            setTimeout(() => setModalMessageParams(undefined), 50);
          },
        });
      });
      return resp;
    };
  }, []);

  const elements = [];
  if (modalQuestionParams) {
    elements.push(<ModalQuestion key={1} {...modalQuestionParams} open={open.question} />);
  }

  if (modalMessageParams) {
    elements.push(<ModalMessage key={2} {...modalMessageParams} open={open.message} />);
  }

  if (elements.length) {
    return <>{elements}</>;
  }
  return null;
};

const ModalQuestion: React.FC<IQuestionModalProps> = ({ closeModal, doubleConfirm, message, title, open }) => {
  const [confirm, setConfirm] = useState(false);
  const okDisabled = !!doubleConfirm && !confirm;

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) {
          closeModal(false);
        }
      }}
    >
      <DialogContent
        className="p-5"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !okDisabled) {
            closeModal(true);
          }
        }}
      >
        <DialogHeader className="space-y-2">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="whitespace-pre-wrap">{message}</DialogDescription>
        </DialogHeader>
        {doubleConfirm && (
          <div className="flex gap-1.5">
            <Checkbox id="confirm" checked={confirm} onCheckedChange={() => setConfirm((prev) => !prev)} />
            <Label htmlFor="confirm">Confirmer</Label>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => closeModal(false)}>
            Non
          </Button>
          <Button type="submit" size="sm" onClick={() => closeModal(true)} disabled={okDisabled}>
            Oui
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const ModalMessage: React.FC<IMessageModalProps> = ({ closeModal, message, title, open }) => {
  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) {
          closeModal();
        }
      }}
    >
      <DialogContent className="p-5">
        <DialogHeader className="space-y-2">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="submit" size="sm" onClick={closeModal}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
