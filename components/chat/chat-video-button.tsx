'use client';

import qs from 'query-string';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Video, VideoOff } from 'lucide-react';
import { ActionToolTip } from '../action-tooltip';

export const ChatVideoButton = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const isVideo = searchParams?.get('video');

  const Icon = isVideo ? VideoOff : Video;
  const tooltipLabel = isVideo ? '结束视频' : '结束通话';

  const onClick = () => {
    const url = qs.stringifyUrl({
      url: pathname || '',
      query: {
        video: isVideo ? undefined : true,
      },
    });

    router.push(url);
  };

  return (
    <ActionToolTip side='bottom' label={tooltipLabel}>
      <button onClick={onClick} className='hover:opacity-75 transition mr-4'>
        <Icon className='size-6 text-zinc-500 dark:text-zinc-400'></Icon>
      </button>
    </ActionToolTip>
  );
};
