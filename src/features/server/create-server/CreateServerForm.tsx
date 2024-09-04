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
import { createServer } from './create-server.action';
import { createServerSchema } from './create-server.schema';

type TCreateServerFormProps = {
  children: (isExecuting: boolean) => React.ReactNode;
  className?: string;
  close?: () => void;
};

const CreateServerForm: React.FC<TCreateServerFormProps> = ({
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
  } = useAction(createServer, {
    onSuccess: ({ data }) => {
      close?.();
      router.push(`/servers/${data!.id}`);
    },
  });

  const form = useZodForm({
    schema: createServerSchema,
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

export default CreateServerForm;
