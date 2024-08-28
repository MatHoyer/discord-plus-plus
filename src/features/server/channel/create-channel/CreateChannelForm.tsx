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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { useAction } from 'next-safe-action/hooks';
import { useRouter } from 'next/navigation';
import React from 'react';
import { createChannel } from './create-channel.action';
import { createChannelSchema } from './create-channel.schema';

type TCreateServerFormProps = {
  children: (isExecuting: boolean) => React.ReactNode;
  className?: string;
  serverId: number;
  close?: () => void;
};

const CreateChannelForm: React.FC<TCreateServerFormProps> = ({
  children,
  className,
  serverId,
  close,
}) => {
  const router = useRouter();
  const session = useSession();
  const {
    execute,
    isExecuting,
    result: state,
  } = useAction(createChannel, {
    onSuccess: ({ data }) => {
      close?.();
      router.push(`/servers/${serverId}/channels/${data!.id}`);
    },
  });

  const form = useZodForm({
    schema: createChannelSchema,
    values: {
      type: 'TEXT',
      name: `Channel of ${session?.data?.user?.name}`,
      serverId,
    },
    mode: 'onChange',
  });

  return (
    <Form {...form} state={state}>
      <FormError state={state} />
      <form onSubmit={form.handleSubmit(execute)} className={cn(className)}>
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CHANNEL TYPE</FormLabel>
              <FormControl>
                <RadioGroup defaultValue="TEXT" onValueChange={field.onChange}>
                  <div>
                    <RadioGroupItem value="TEXT" id="TEXT" />
                    text
                  </div>
                  <div>
                    <RadioGroupItem value="AUDIO" id="AUDIO" />
                    audio
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CHANNEL NAME</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {children(isExecuting)}
      </form>
    </Form>
  );
};

export default CreateChannelForm;
