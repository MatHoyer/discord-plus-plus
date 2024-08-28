import { Loader } from 'lucide-react';
import SwitchingButton from '../SwitchingButton';
import { ButtonProps } from '../ui/button';

export const SubmitButton: React.FC<{ loading: boolean } & ButtonProps> = ({
  loading,
  disabled,
  ...props
}) => {
  return (
    <LoadingButton
      type="submit"
      loading={loading}
      disabled={disabled || loading}
      {...props}
    >
      {props.children}
    </LoadingButton>
  );
};

export const LoadingButton = ({
  loading,
  children,
  className,
  ...props
}: ButtonProps & {
  loading?: boolean;
  success?: string;
}) => {
  return (
    <SwitchingButton
      condition={loading}
      initialContent={children}
      switchingContent={<Loader size={20} className="animate-spin" />}
      {...props}
    />
  );
};
