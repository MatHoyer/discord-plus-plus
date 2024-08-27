interface IModal {
  error: (params: IMessageParams) => Promise<boolean>;
  info: (params: IMessageParams) => Promise<boolean>;
  question: (params: IQuestionParams) => Promise<boolean>;
}

interface IMessageParams {
  title?: string;
  message?: string;
}

interface IQuestionParams extends IMessageParams {
  doubleConfirm?: boolean;
}

interface IQuestionModalProps extends IQuestionParams {
  closeModal: (answer: boolean) => void;
  open?: boolean;
}

type TMessageType = 'error' | 'warning' | 'info';

interface IMessageModalProps extends IMessageParams {
  closeModal: () => void;
  open?: boolean;
  messageType: TMessageType;
}
