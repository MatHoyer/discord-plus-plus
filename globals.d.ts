import { useZodForm } from '@/components/ui/form';
import {
  Attachment,
  Channel,
  Mention,
  Message,
  MessageReaction,
  MessageReactionMember,
  User,
  UserGuildProfile,
} from '@prisma/client';
import { ZodType } from 'zod';

declare global {
  interface ChannelWithParticipants extends Channel {
    participants: User[];
  }

  interface MemberWithUser extends UserGuildProfile {
    user: User;
  }

  interface MentionWithUser extends Mention {
    member: MemberWithUser;
  }

  interface MessageReactionWithMembers extends MessageReaction {
    members: (MessageReactionMember & { member: MemberWithUser })[];
  }

  interface MessageWithSender extends Message {
    author: MemberWithUser;
    mentions: MentionWithUser[];
    reactions: MessageReactionWithMembers[];
    referencedMessage: MessageWithSender;
    attachments?: Attachment[];
  }

  interface ChannelWithMessages extends Channel {
    messages: MessageWithSender[];
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

  type TGuildWithMembersAndProfiles = Server & {
    members: (Member & { user: User })[];
  };

  type TZodFormReturnType<T extends ZodType> = ReturnType<typeof useZodForm<T>>;
}
