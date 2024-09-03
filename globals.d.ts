import { useZodForm } from '@/components/ui/form';
import {
  Channel,
  Member,
  Server,
  ServerMention,
  ServerMessage,
  User,
} from '@prisma/client';
import { ZodType } from 'zod';

declare global {
  interface ServerMentionWithUser extends ServerMention {
    member: Member;
  }

  interface ServerMessageWithSender extends ServerMessage {
    sender: Member & { user: User };
    mentions: ServerMentionWithUser[];
  }

  interface ChannelWithMessages extends Channel {
    messages: ServerMessageWithSender[];
  }

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

  type TData<T> = T | { message: string };

  type TFormState<T = unknown> = {
    data?: TData<T>;
    serverError?: string;
    fetchError?: string;
    validationErrors?: Record<string, string[] | undefined> | undefined;
  };

  type LayoutParams<T extends Record<string, string> = {}> = {
    params: T;
    children?: ReactNode | undefined;
  };

  type PageParams<T extends Record<string, string> = {}> = {
    params: T;
    searchParams: { [key: string]: string | string[] | undefined };
  };

  type TServerWithMembersAndProfiles = Server & {
    members: (Member & { user: User })[];
  };

  type TZodFormReturnType<T extends ZodType> = ReturnType<typeof useZodForm<T>>;
}
