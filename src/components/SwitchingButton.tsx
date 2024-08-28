'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Button, ButtonProps } from './ui/button';

type TSwitchingButtonProps = {
  condition?: boolean;
  initialContent: React.ReactNode;
  switchingContent: React.ReactNode;
} & ButtonProps;

const SwitchingButton: React.FC<TSwitchingButtonProps> = ({
  condition,
  initialContent,
  switchingContent,
  className,
  ...props
}) => {
  return (
    <Button {...props} className={cn(className, 'relative')}>
      <motion.span
        animate={{
          opacity: condition ? 0 : 1,
          y: condition ? -10 : 0,
          overflow: condition ? 'hidden' : 'visible',
        }}
      >
        {initialContent}
      </motion.span>
      <motion.span
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: condition ? 1 : 0,
          y: condition ? 0 : 10,
          overflow: condition ? 'visible' : 'hidden',
        }}
        exit={{
          opacity: 0,
          y: 10,
        }}
        className="absolute inset-0 flex items-center justify-center"
      >
        {switchingContent}
      </motion.span>
    </Button>
  );
};

export default SwitchingButton;
