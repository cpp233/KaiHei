import { redirect } from 'next/navigation';
import { ChannelType, MemberRole } from '@prisma/client';

import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import ServerHeader from '@/components/server/server-header';
import ServerSearch from '@/components/server/server-search';
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from 'lucide-react';
import ServerSection from '@/components/server/server-section';
import ServerChannel from '@/components/server/server-channel';
import ServerMember from '@/components/server/server-member';

interface ServerSideBarProps {
  serverId: string;
}

const iconMap = {
  [ChannelType.TEXT]: <Hash className='mr-2 h-4 w-4'></Hash>,
  [ChannelType.AUDIO]: <Mic className='mr-2 h-4 w-4'></Mic>,
  [ChannelType.VIDEO]: <Video className='mr-2 h-4 w-4'></Video>,
};
const roleIconMap = {
  [MemberRole.ADMIN]: (
    <ShieldCheck className='h-4 w-4 text-indigo-500'></ShieldCheck>
  ),
  [MemberRole.MODERATOR]: (
    <ShieldAlert className='h-4 w-4 text-rose-500'></ShieldAlert>
  ),
  [MemberRole.GUEST]: null,
};

const ServerSideBar = async ({ serverId }: ServerSideBarProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect('/');
  }

  const server = await db.server.findUnique({
    where: { id: serverId },
    include: {
      channels: {
        orderBy: {
          createdAt: 'asc',
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: 'asc',
        },
      },
    },
  });

  if (!server) {
    return redirect('/');
  }

  const textChannels = server.channels.filter(
    channel => channel.type === ChannelType.TEXT
  );
  const audioChannels = server.channels.filter(
    channel => channel.type === ChannelType.AUDIO
  );
  const videoChannels = server.channels.filter(
    channel => channel.type === ChannelType.VIDEO
  );

  const members = server.members.filter(
    member => member.profileId !== profile.id
  );

  const role = server.members.find(
    member => member.profileId === profile.id
  )?.role;

  return (
    <div className='flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]'>
      <ServerHeader server={server} role={role}></ServerHeader>
      <ScrollArea className='flex-1 px=3'>
        <div className='mt-2'>
          <ServerSearch
            data={[
              {
                label: '文字频道',
                type: 'channel',
                data: textChannels?.map(channel => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: '语音频道',
                type: 'channel',
                data: audioChannels.map(channel => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: '视频频道',
                type: 'channel',
                data: videoChannels.map(channel => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: '成员',
                type: 'member',
                data: members?.map(member => ({
                  id: member.id,
                  name: member.profile.name,
                  icon: roleIconMap[member.role],
                })),
              },
            ]}
          ></ServerSearch>
          <Separator className='bg-zinc-200 dark:bg-zinc-700 rounded-md my-2'></Separator>

          {!!textChannels.length && (
            <div className='mb-2'>
              <ServerSection
                sectionType='channels'
                channelType={ChannelType.TEXT}
                role={role}
                label='文字频道'
              ></ServerSection>
              <div className='space-y-[2px]'>
                {textChannels.map(channel => (
                  <ServerChannel
                    key={channel.id}
                    channel={channel}
                    server={server}
                    role={role}
                  ></ServerChannel>
                ))}
              </div>
            </div>
          )}

          <div className='space-y-[2px]'>
            {!!audioChannels.length && (
              <div className='mb-2'>
                <ServerSection
                  sectionType='channels'
                  channelType={ChannelType.AUDIO}
                  role={role}
                  label='语音频道'
                ></ServerSection>
                <div className='space-y-[2px]'>
                  {audioChannels.map(channel => (
                    <ServerChannel
                      key={channel.id}
                      channel={channel}
                      server={server}
                      role={role}
                    ></ServerChannel>
                  ))}
                </div>
              </div>
            )}
          </div>

          {!!videoChannels.length && (
            <div className='mb-2'>
              <ServerSection
                sectionType='channels'
                channelType={ChannelType.VIDEO}
                role={role}
                label='视频频道'
              ></ServerSection>

              <div className='space-y-[2px]'>
                {videoChannels.map(channel => (
                  <ServerChannel
                    key={channel.id}
                    channel={channel}
                    server={server}
                    role={role}
                  ></ServerChannel>
                ))}
              </div>
            </div>
          )}

          {!!members.length && (
            <div className='mb-2'>
              <ServerSection
                sectionType='members'
                channelType={ChannelType.VIDEO}
                role={role}
                label='成员列表'
                server={server}
              ></ServerSection>
              <div className='space-y-[2px]'>
                {members.map(member => (
                  <ServerMember
                    key={member.id}
                    member={member}
                    server={server}
                  ></ServerMember>
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ServerSideBar;
