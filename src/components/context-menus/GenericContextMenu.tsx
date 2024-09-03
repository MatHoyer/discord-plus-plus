import { cn } from '@/lib/utils';
import { LucideProps } from 'lucide-react';
import { PropsWithChildren } from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '../ui/context-menu';

const isSeparator = (item: TItem): item is { seperator: true } => {
  return (item as any).seperator === true;
};

type TItem =
  | {
      label?: string;
      icon?: React.ComponentType<LucideProps>;
      customRender?: () => React.ReactNode;
      onClick?: (item: TItem, index: number) => void;
    }
  | {
      seperator: true;
    };

type TGenericContextMenuProps<T extends TItem> = {
  items: T[];
  contentClassName?: string;
  computeMenuItemClassName?: (item: T, index: number) => string;
} & PropsWithChildren;

const GenericContextMenu = <T extends TItem>({
  items,
  contentClassName,
  computeMenuItemClassName,
  children,
}: TGenericContextMenuProps<T>) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent
        className={cn(
          'bg-[#111214] w-[200px] border-[#2e2f34]',
          contentClassName
        )}
      >
        {items.map((item, index) =>
          isSeparator(item) ? (
            <ContextMenuSeparator key={index} className="bg-[#2e2f34]" />
          ) : (
            <ContextMenuItem
              key={index}
              className={cn(
                'hover:bg-[#4752c4] cursor-pointer text-xs',
                computeMenuItemClassName?.(item, index)
              )}
              onClick={() => {
                item.onClick?.(item, index);
              }}
            >
              {item.label}
              {item.icon && <item.icon className="w-4 h-4 ml-auto" />}
            </ContextMenuItem>
          )
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default GenericContextMenu;
