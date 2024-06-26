'use client';

import { cn } from '@/lib/utils';
import { Channel, ChannelType, MemberRole, Server } from '@prisma/client';
import { Edit, Hash, Lock, Mic, Trash, Video } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

import { ActionToolTip } from '@/components/action-tooltip';
import { useModal, ModalType } from '@/hooks/use-modal-store';

import { ServerWithMembersWithProfiles } from '@/types';
import { DEFAULT_CHANNEL } from '@/lib/getEnv';

interface ServerChannelProps {
  channel: Channel;
  server: ServerWithMembersWithProfiles;
  role?: MemberRole;
}

const iconMap = {
  [ChannelType.TEXT]: Hash,
  [ChannelType.AUDIO]: Mic,
  [ChannelType.VIDEO]: Video,
};

function ServerChannel({ channel, server, role }: ServerChannelProps) {
  const params = useParams();
  const router = useRouter();
  const { onOpen } = useModal();

  const Icon = iconMap[channel.type];

  const onClick = () => {
    router.push(`/servers/${server.id}/channels/${channel.id}`);
  };

  const onAction = (e: React.MouseEvent, action: ModalType) => {
    e.stopPropagation();
    onOpen(action, { channel, server });
  };

  return (
    <button
      className={cn(
        'group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1',
        params?.channelId === channel.id && 'bg-zinc-700/20 dark:bg-zinc-700'
      )}
      onClick={onClick}
    >
      <Icon className='flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400'></Icon>
      <p
        className={cn(
          'line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition',
          params?.channelId === channel.id &&
            'text-primary dark:text-zinc-200 dark:group-hover:text-white'
        )}
      >
        {channel.name}
      </p>
      {channel.name === DEFAULT_CHANNEL && (
        <Lock className='ml-auto w-4 h-4 text-zinc-500 dark:text-zinc-400'></Lock>
      )}
      {channel.name !== DEFAULT_CHANNEL && role !== MemberRole.GUEST && (
        <div className='ml-auto flex items-center gap-x-2'>
          <ActionToolTip label='编辑'>
            <Edit
              className='hidden group-hover:block w-4 h-4 text-zinc-500 dark:text-zinc-400 dark:hover:text-zinc-300 transition'
              onClick={e => onAction(e, 'editChannel')}
            ></Edit>
          </ActionToolTip>
          <ActionToolTip label='删除'>
            <Trash
              className='hidden group-hover:block w-4 h-4 text-zinc-500 dark:text-zinc-400 dark:hover:text-zinc-300 transition'
              onClick={e => onAction(e, 'deleteChannel')}
            ></Trash>
          </ActionToolTip>
        </div>
      )}
    </button>
  );
}

export default ServerChannel;
