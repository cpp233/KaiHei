'use client';

import { ChannelType, MemberRole } from '@prisma/client';
import { Plus, Settings } from 'lucide-react';

import { ActionToolTip } from '@/components/action-tooltip';
import { useModal } from '@/hooks/use-modal-store';
import { ServerWithMembersWithProfiles } from '@/types';

interface ServerSectionProps {
  label: string;
  role?: MemberRole;
  sectionType: 'channels' | 'members';
  channelType: ChannelType;
  server?: ServerWithMembersWithProfiles;
}

function ServerSection({
  label,
  role,
  sectionType,
  channelType,
  server,
}: ServerSectionProps) {
  const { onOpen } = useModal();

  return (
    <div className='flex items-center justify-between  py-2'>
      <p className='text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400'>
        {label}
      </p>
      {role !== MemberRole.GUEST && sectionType === 'channels' && (
        <ActionToolTip label='创建频道' side='top'>
          <button
            className='text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition'
            onClick={() => onOpen('createChannel', { channelType })}
          >
            <Plus className='w-4 h-4' />
          </button>
        </ActionToolTip>
      )}
      {role === MemberRole.ADMIN && sectionType === 'members' && (
        <ActionToolTip label='管理成员' side='top'>
          <button
            className='text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition'
            onClick={() => onOpen('manageMembers', { server })}
          >
            <Settings className='w-4 h-4' />
          </button>
        </ActionToolTip>
      )}
    </div>
  );
}

export default ServerSection;
