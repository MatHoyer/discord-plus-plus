import { cn, isFunction } from '@/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';
import { LucideProps } from 'lucide-react';
import { PropsWithChildren } from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '../ui/context-menu';

export const isSeparator = (item: TItem): item is { seperator: true } => {
  return (item as any).seperator === true;
};

type TGenericContextMenuItemProps<T extends TItem> = {
  item: T;
  index: number;
  computeMenuItemClassName?: (item: T, index: number) => string;
};

const GenericContextMenuItem = <T extends TItem>({
  item,
  index,
  computeMenuItemClassName,
}: TGenericContextMenuItemProps<T>) => {
  return isSeparator(item) ? (
    <ContextMenuSeparator className="bg-[#2e2f34]" />
  ) : item.when === undefined ||
    (item.when &&
      (isFunction(item.when) ? item.when(item, index) : item.when)) ? (
    item.subItems ? (
      <ContextMenuSub>
        <ContextMenuSubTrigger
          className={cn(
            'focus:bg-[#4752c4] data-[state=open]:bg-[#4752c4] cursor-pointer text-xs dark:text-neutral-400 dark:hover:text-white dark:data-[state=open]:text-white font-semibold',
            computeMenuItemClassName?.(item, index)
          )}
          onClick={() => {
            item.subItemTriggerOnClick?.(item, index);
          }}
        >
          {item.customRender ? item.customRender(item, index) : item.label}
        </ContextMenuSubTrigger>
        <ContextMenuSubContent
          className="bg-[#111214] min-w-[200px] border-[#2e2f34]"
          sideOffset={10}
          alignOffset={-5}
        >
          {item.subItems.map((subItem, subItemIndex) => (
            <GenericContextMenuItem
              key={subItemIndex}
              index={subItemIndex}
              item={subItem}
              computeMenuItemClassName={computeMenuItemClassName}
            />
          ))}
        </ContextMenuSubContent>
      </ContextMenuSub>
    ) : (
      <ContextMenuItem
        key={index}
        className={cn(
          menuItemVariants({
            className: computeMenuItemClassName?.(item, index),
            variant: item.variant,
          })
        )}
        onClick={(e) => {
          item.onClick?.({ item, index, e });
        }}
      >
        {item.customRender ? (
          item.customRender(item, index)
        ) : (
          <>
            {item.label}
            {item.icon && <item.icon className="w-4 h-4 ml-auto" />}
          </>
        )}
      </ContextMenuItem>
    )
  ) : null;
};

export const menuItemVariants = cva(
  'cursor-pointer text-xs text-white font-semibold dark:hover:text-white',
  {
    variants: {
      variant: {
        default: 'dark:text-neutral-400 dark:hover:bg-[#4752c4]',
        destructive: 'dark:text-[#f23f42] hover:dark:bg-[#da373c]',
        blue: 'text-indigo-400 dark:hover:bg-[#4752c4]',
      },
    },
    defaultVariants: { variant: 'default' },
  }
);

type TItem =
  | ({
      label?: string;
      icon?: React.ComponentType<LucideProps>;
      customRender?: (item: TItem, index: number) => React.ReactNode;
      onClick?: ({
        item,
        index,
        e,
      }: {
        item: TItem;
        index: number;
        e: React.MouseEvent;
      }) => void;
      when?: boolean | ((item: TItem, index: number) => boolean);
      subItems?: TItem[];
      subItemTriggerOnClick?: (item: TItem, index: number) => void;
    } & VariantProps<typeof menuItemVariants>)
  | {
      seperator: true;
    };

type TGenericContextMenuProps<T extends TItem> = {
  items: T[];
  contentClassName?: string;
  computeMenuItemClassName?: (item: T, index: number) => string;
  disabled?: boolean;
} & PropsWithChildren;

const GenericContextMenu = <T extends TItem>({
  items,
  contentClassName,
  computeMenuItemClassName,
  children,
  disabled,
}: TGenericContextMenuProps<T>) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent
        className={cn(
          'min-w-[200px] border-[#2e2f34]',
          contentClassName,
          disabled && 'hidden'
        )}
      >
        {items.map((item, index) => (
          <GenericContextMenuItem
            key={index}
            index={index}
            item={item}
            computeMenuItemClassName={computeMenuItemClassName}
          />
        ))}
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default GenericContextMenu;
