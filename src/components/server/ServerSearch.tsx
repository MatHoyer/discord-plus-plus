'use client';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from '../ui/command';
import { DialogTitle } from '../ui/dialog';

type TServerSearchProps = {
  serverId: number;
  data: {
    label: string;
    type: 'channel' | 'member';
    rows:
      | {
          icon: React.ReactNode;
          name: string;
          id: number;
        }[]
      | undefined;
  }[];
};

const ServerSearch: React.FC<TServerSearchProps> = ({ serverId, data }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);

    return () => document.removeEventListener('keydown', down);
  }, []);

  const onSuggestionSelected = (id: number, type: 'channel' | 'member') => {
    setIsOpen(false);
    if (type === 'channel') {
      return router.push(`/servers/${serverId}/channels/${id}`);
    }

    return router.push(`/conversation/${id}`);
  };

  return (
    <>
      <button
        onClick={() => {
          setIsOpen(true);
        }}
        className="group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition-colors"
      >
        <Search className="w-4 h-4 text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors" />
        <p className="font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
          Search
        </p>
        <CommandShortcut>ctrl k</CommandShortcut>
      </button>
      <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTitle className="sr-only">
          Search within the whole server
        </DialogTitle>
        <CommandInput placeholder="Search all channels and members" />
        <CommandList>
          <CommandEmpty>No results found</CommandEmpty>
          {data.map((category) => {
            if (!category.rows?.length) return null;

            return (
              <CommandGroup key={category.label} heading={category.label}>
                {category.rows.map((row) => (
                  <CommandItem
                    key={row.id}
                    className="cursor-pointer"
                    onSelect={() => {
                      onSuggestionSelected(row.id, category.type);
                    }}
                  >
                    {row.icon}
                    {row.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            );
          })}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default ServerSearch;
