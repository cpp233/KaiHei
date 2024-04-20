import { redirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

import { initProfile } from '@/lib/init-profile';
import { db } from '@/lib/db';

interface InviteCodeProps {
  params: {
    inviteCode: string;
  };
}

const InviteCodePage = async ({ params }: InviteCodeProps) => {
  const profile = await initProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  if (!params.inviteCode) {
    return redirect('/');
  }

  const existServer = await db.server.findFirst({
    where: {
      inviteCode: params.inviteCode,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  // 确实存在这个邀请码，则跳转。
  if (existServer) {
    return redirect(`/servers/${existServer.id}`);
  }

  // 把当前用户加入到服务器中
  const server = await db.server.update({
    where: {
      inviteCode: params.inviteCode,
    },
    data: {
      members: {
        create: [
          {
            profileId: profile.id,
          },
        ],
      },
    },
  });

  if (server) {
    return redirect(`/servers/${server.id}`);
  }

  return null;
};
export default InviteCodePage;
