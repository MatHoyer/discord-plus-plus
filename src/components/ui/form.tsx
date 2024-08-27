import { zodResolver } from '@hookform/resolvers/zod';
import * as LabelPrimitive from '@radix-ui/react-label';
import { Slot } from '@radix-ui/react-slot';
import * as React from 'react';
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  FormProviderProps,
  useForm,
  useFormContext,
} from 'react-hook-form';

import type { UseFormProps } from 'react-hook-form';

import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { TypeOf, ZodSchema } from 'zod';

type TCustomFormContext = {
  state?: TFormState;
};

const CustomFormContext = React.createContext<TCustomFormContext | undefined>(
  undefined
);

const useCustomFormContext = () => {
  const context = React.useContext(CustomFormContext);

  if (!context) {
    throw new Error(
      'useCustomFormContext must be used within a CustomFormProvider'
    );
  }

  return context;
};

type TCustomFormProviderProps<
  TFieldValues extends FieldValues,
  TContext = any,
  TTransformedValues extends FieldValues | undefined = undefined
> = {
  state?: TFormState;
} & React.PropsWithChildren &
  FormProviderProps<TFieldValues, TContext, TTransformedValues>;

const CustomFormProvider = <
  TFieldValues extends FieldValues,
  TContext = any,
  TTransformedValues extends FieldValues | undefined = undefined
>({
  state,
  children,
  ...props
}: TCustomFormProviderProps<TFieldValues, TContext, TTransformedValues>) => {
  return (
    <FormProvider {...props}>
      <CustomFormContext.Provider value={{ state }}>
        {children}
      </CustomFormContext.Provider>
    </FormProvider>
  );
};

const Form = CustomFormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>');
  }

  const { id } = itemContext;
  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
);

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn('space-y-2', className)} {...props} />
    </FormItemContext.Provider>
  );
});
FormItem.displayName = 'FormItem';

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { error, formItemId, name } = useFormField();
  const { state } = useCustomFormContext();

  const stateError = !!state?.validationErrors?.[name];

  return (
    <Label
      ref={ref}
      className={cn((error || stateError) && 'text-red-500', className)}
      htmlFor={formItemId}
      {...props}
    />
  );
});
FormLabel.displayName = 'FormLabel';

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  );
});
FormControl.displayName = 'FormControl';

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField();

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  );
});

FormDescription.displayName = 'FormDescription';

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId, name } = useFormField();
  const { state } = useCustomFormContext();

  const stateError =
    state?.validationErrors && state.validationErrors?.[name]
      ? state.validationErrors[name]
      : undefined;

  const body = stateError
    ? stateError
    : error
    ? String(error.message)
    : children;

  if (!body) {
    return null;
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn('text-sm font-medium text-red-500', className)}
      {...props}
    >
      {body}
    </p>
  );
});

FormMessage.displayName = 'FormMessage';

const FormError = React.forwardRef<
  HTMLParagraphElement,
  { state: TFormState } & React.HTMLAttributes<HTMLParagraphElement>
>(({ state, className, ...props }, ref) => {
  return (
    state?.serverError && (
      <p
        {...props}
        className={cn('text-sm font-medium text-red-500', className)}
        ref={ref}
      >
        {state.serverError}
      </p>
    )
  );
});

FormError.displayName = 'FormError';

type UseZodFormProps<Z extends ZodSchema> = Exclude<
  UseFormProps<TypeOf<Z>>,
  'resolver'
> & {
  schema: Z;
};

const useZodForm = <Z extends ZodSchema>({
  schema,
  ...formProps
}: UseZodFormProps<Z>) =>
  useForm({
    ...formProps,
    resolver: zodResolver(schema),
  });

export {
  Form,
  FormControl,
  FormDescription,
  FormError,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
  useZodForm,
};
