'use client';
import { useModal } from '@/hooks/useModalStore';
import { checkRole } from '@/lib/utils/member.utils';
import { MemberRole } from '@prisma/client';
import {
  ChevronDown,
  LogOut,
  PlusCircle,
  Settings,
  Trash2,
  UserPlus,
  Users,
} from 'lucide-react';
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

type TServerHeaderProps = {
  server: TServerWithMembersAndProfiles;
  role?: MemberRole;
};

const ServerHeader: React.FC<TServerHeaderProps> = ({
  server,
  role = MemberRole.GUEST,
}) => {
  const { openModal } = useModal();
  const { isAdmin, isModerator } = checkRole(role);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none" asChild>
        <button className="w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition">
          <span className="truncate">{server.name}</span>
          <ChevronDown className="h-5 w-5 ml-auto" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 font-medium text-black dark:text-neutral-400 space-y-[2px]">
        {isModerator && (
          <DropdownMenuItem
            onClick={() => {
              openModal('invite', { server });
            }}
            variant="blue"
            className=" focus:text-white px-3 py-2 cursor-pointer"
          >
            Invite people
            <UserPlus className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <>
            <DropdownMenuItem className="px-3 py-2 cursor-pointer">
              Server Settings
              <Settings className="h-4 w-4 ml-auto" />
            </DropdownMenuItem>
            <DropdownMenuItem className="px-3 py-2 cursor-pointer">
              Manager Members
              <Users className="h-4 w-4 ml-auto" />
            </DropdownMenuItem>
          </>
        )}
        {isModerator && (
          <DropdownMenuItem
            onClick={() => {
              openModal('createChannel', { server });
            }}
            className="px-3 py-2 cursor-pointer"
          >
            Create Channel
            <PlusCircle className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isModerator && <DropdownMenuSeparator />}
        {isAdmin && (
          <DropdownMenuItem
            className="px-3 py-2 cursor-pointer"
            variant="destructive"
          >
            Delete Server
            <Trash2 className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {!isAdmin && (
          <DropdownMenuItem
            className="px-3 py-2 cursor-pointer "
            variant="destructive"
          >
            Leave Server
            <LogOut className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ServerHeader;
