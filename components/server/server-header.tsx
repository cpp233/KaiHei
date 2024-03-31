'use client';

import { MemberRole } from '@prisma/client';
import { ChevronDown, UserPlus, Settings, Trash } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { ServerWithMembersWithProfiles } from '@/types';

interface ServerHeaderProps {
  server: ServerWithMembersWithProfiles;
  role?: MemberRole;
}

const ServerHeader = ({ server, role }: ServerHeaderProps) => {
  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = isAdmin || role === MemberRole.MODERATOR;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='focus:outline-none' asChild>
        <button className='w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition'>
          {server.name}
          <ChevronDown className='h-5 w-5 ml-auto'></ChevronDown>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className='w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]'>
        {isModerator && (
          <DropdownMenuItem className='text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer'>
            邀请加入
            <UserPlus className='h-4 w-4 ml-auto'></UserPlus>
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem className='px-3 py-2 text-sm cursor-pointer'>
            服务器设置
            <Settings className='h-4 w-4 ml-auto'></Settings>
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem className='px-3 py-2 text-sm cursor-pointer'>
            管理成员
            <Settings className='h-4 w-4 ml-auto'></Settings>
          </DropdownMenuItem>
        )}
        {isModerator && (
          <DropdownMenuItem className='px-3 py-2 text-sm cursor-pointer'>
            新建频道
            <Settings className='h-4 w-4 ml-auto'></Settings>
          </DropdownMenuItem>
        )}
        {isModerator && <DropdownMenuSeparator></DropdownMenuSeparator>}

        {isAdmin && (
          <DropdownMenuItem className='px-3 py-2 text-sm cursor-pointer text-rose-500'>
            删除服务器
            <Trash className='h-4 w-4 ml-auto'></Trash>
          </DropdownMenuItem>
        )}
        {!isAdmin && (
          <DropdownMenuItem className='px-3 py-2 text-sm cursor-pointer text-rose-500'>
            离开服务器
            <Trash className='h-4 w-4 ml-auto'></Trash>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ServerHeader;
