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
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { socket } from '@/socket';
import { Channeltype } from '@prisma/client';
import { Hash, Volume2 } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { useRouter } from 'next/navigation';
import React, { useId } from 'react';
import { createChannel } from './create-channel.action';
import { createChannelSchema } from './create-channel.schema';

type TCreateServerFormProps = {
  children: ({
    pending,
    form,
  }: {
    pending: boolean;
    form: TZodFormReturnType<typeof createChannelSchema>;
  }) => React.ReactNode;
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
  const {
    execute,
    isExecuting,
    result: state,
  } = useAction(createChannel, {
    onSuccess: ({ data }) => {
      close?.();
      router.push(`/servers/${serverId}/channels/${data!.id}`);
      socket.emit('new-channel', data);
    },
  });

  const form = useZodForm({
    schema: createChannelSchema,
    defaultValues: {
      type: 'TEXT',
      name: '',
      serverId: serverId,
    },
    mode: 'onTouched',
  });

  return (
    <Form {...form} state={state}>
      <FormError state={state} />
      <form
        onSubmit={form.handleSubmit(execute)}
        className={cn('space-y-3', className)}
      >
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CHANNEL TYPE</FormLabel>
              <FormControl>
                <RadioGroup
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  <ChannelTypeRadio
                    fieldValue={field.value}
                    value="TEXT"
                    label="Text"
                    description="Share images, GIFs, emjois, opinions, and more"
                    icon={<Hash className="w-5 h-5" />}
                  />
                  <ChannelTypeRadio
                    fieldValue={field.value}
                    value="AUDIO"
                    label="Audio"
                    description="Join voice channels to chat with your friends"
                    icon={<Volume2 className="w-5 h-5" />}
                  />
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
                <Input {...field} placeholder="new-channel" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {children({ pending: isExecuting, form })}
      </form>
    </Form>
  );
};

export default CreateChannelForm;

const ChannelTypeRadio: React.FC<{
  fieldValue: Channeltype;
  value: Channeltype;
  label: string;
  description: string;
  icon: React.ReactNode;
}> = ({ fieldValue, value, description, icon, label }) => {
  const id = useId();

  return (
    <Label
      className={cn(
        'flex items-center space-x-2 bg-primary/10 hover:bg-primary/30 py-3 px-2 gap-2 rounded-md cursor-pointer transition-colors',
        fieldValue === value && 'bg-primary/30'
      )}
      htmlFor={id}
    >
      {icon}
      <div className="flex flex-1 justify-between items-center">
        <div className="flex flex-col gap-1">
          <span className="text-md cursor-pointer">{label}</span>
          <span className="text-sm">{description}</span>
        </div>
        <RadioGroupItem value={value} id={id} />
      </div>
    </Label>
  );
};
