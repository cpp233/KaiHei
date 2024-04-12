'use client';

import { useEffect, useState } from 'react';
import { LiveKitRoom, VideoConference } from '@livekit/components-react';

import '@livekit/components-styles';
import { useUser } from '@clerk/nextjs';
import { Loader2 } from 'lucide-react';

interface MediaRoomProps {
  chatId: string;
  isVideo: boolean;
  isAudio: boolean;
}
export const MediaRoom = ({ chatId, isVideo, isAudio }: MediaRoomProps) => {
  const { user } = useUser();
  const [token, setToken] = useState('');

  useEffect(() => {
    if (!user?.username) {
      return;
    }

    const name = user.username;

    const init = async () => {
      try {
        const resp = await fetch(
          `/api/livekit?room=${chatId}&username=${name}`
        );
        const data = await resp.json();
        setToken(data.token);
      } catch (error) {
        console.log(error);
      }
    };
    init();
  }, [user?.username, chatId]);

  if (token === '') {
    return (
      <div className='flex flex-col flex-1 justify-center items-center'>
        <Loader2 className='size-7 text-zinc-500 animate-spin my-4'></Loader2>
        <p className='text-xs text-zinc-500 dark:text-zinc-400'>流加载中...</p>
      </div>
    );
  }

  return (
    <LiveKitRoom
      video={isVideo}
      audio={isAudio}
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      //
      // connect={true}
      data-lk-theme='default'
    >
      <VideoConference />
    </LiveKitRoom>
  );
};
