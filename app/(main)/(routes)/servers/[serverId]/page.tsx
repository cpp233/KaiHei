import { auth } from '@clerk/nextjs/server';

import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { DEFAULT_CHANNEL } from '@/lib/getEnv';
import { redirect } from 'next/navigation';

interface ServerIdPageProps {
  params: {
    serverId: string;
  };
}

// 重定向到 DEFAULT_CHANNEL 频道
const ServerIdPage = async ({ params }: ServerIdPageProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return auth().redirectToSignIn();
  }

  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
    include: {
      channels: {
        where: {
          name: DEFAULT_CHANNEL,
        },
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
  });

  const initChannel = server?.channels[0];

  if (initChannel?.name !== DEFAULT_CHANNEL) {
    return null;
  }

  return redirect(`/servers/${params?.serverId}/channels/${initChannel?.id}`);
};
export default ServerIdPage;
