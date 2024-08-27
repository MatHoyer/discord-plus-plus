import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';
import { Button, ButtonProps } from '../ui/button';

export const SubmitButton: React.FC<{ loading: boolean } & ButtonProps> = ({
  loading,
  ...props
}) => {
  return (
    <LoadingButton type="submit" loading={loading} {...props}>
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
    <Button {...props} className={cn(className, 'relative')}>
      <motion.span
        animate={{
          opacity: loading ? 0 : 1,
          y: loading ? -10 : 0,
          overflow: loading ? 'hidden' : 'visible',
        }}
      >
        {children}
      </motion.span>
      <motion.span
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: loading ? 1 : 0,
          y: loading ? 0 : 10,
          overflow: loading ? 'visible' : 'hidden',
        }}
        exit={{
          opacity: 0,
          y: 10,
        }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Loader size={20} className="animate-spin" />
      </motion.span>
    </Button>
  );
};
