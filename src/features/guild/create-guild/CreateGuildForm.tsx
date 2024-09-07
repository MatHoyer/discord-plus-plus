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
import { useSession } from 'next-auth/react';
import { useAction } from 'next-safe-action/hooks';
import { useRouter } from 'next/navigation';
import React from 'react';
import { createGuild } from './create-guild.action';
import { createGuildSchema } from './create-guild.schema';

type TCreateGuildFormProps = {
  children: (isExecuting: boolean) => React.ReactNode;
  className?: string;
  close?: () => void;
};

const CreateGuileForm: React.FC<TCreateGuildFormProps> = ({
  children,
  className,
  close,
}) => {
  const router = useRouter();
  const session = useSession();
  const {
    execute,
    isExecuting,
    result: state,
  } = useAction(createGuild, {
    onSuccess: ({ data }) => {
      close?.();
      router.push(`/guilds/${data!.id}`);
    },
  });

  const form = useZodForm({
    schema: createGuildSchema,
    values: {
      name: `Server of ${session?.data?.user?.name}`,
    },
    mode: 'onChange',
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
                <FormLabel>SERVER NAME</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {children(isExecuting)}
      </form>
    </Form>
  );
};

export default CreateGuileForm;
