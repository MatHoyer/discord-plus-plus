'use client';
import {
  Form,
  FormControl,
  FormError,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useZodForm,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { socket } from '@/socket';
import { Channel } from '@prisma/client';
import { useAction } from 'next-safe-action/hooks';
import { useRouter } from 'next/navigation';
import React from 'react';
import { ServerSocketEvents } from '../../../../../server/socket/server';
import { editChannel } from './edit-channel.action';
import { editChannelSchema } from './edit-channel.schema';

type TCreateChannelFormProps = {
  children: ({
    pending,
    form,
  }: {
    pending: boolean;
    form: TZodFormReturnType<typeof editChannelSchema>;
  }) => React.ReactNode;
  className?: string;
  channel: Channel;
  close?: () => void;
};

const EditChannelForm: React.FC<TCreateChannelFormProps> = ({
  children,
  className,
  channel,
  close,
}) => {
  const router = useRouter();
  const {
    execute,
    isExecuting,
    result: state,
  } = useAction(editChannel, {
    onSuccess: ({ data }) => {
      close?.();
      router.refresh();
      socket.emit(ServerSocketEvents.editChannel, data);
    },
  });

  const form = useZodForm({
    schema: editChannelSchema,
    defaultValues: {
      name: '',
      channelId: channel.id,
    },
    mode: 'onTouched',
  });

  return (
    <Form {...form} state={state}>
      <FormError state={state} />
      <form onSubmit={form.handleSubmit(execute)}>
        <div className={cn('space-y-3', className)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CHANNEL NAME</FormLabel>
                <FormControl>
                  <Input {...field} placeholder={channel.name} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {children({ pending: isExecuting, form })}
      </form>
    </Form>
  );
};

export default EditChannelForm;
