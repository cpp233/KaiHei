import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

import { initProfile } from '@/lib/init-profile';
import { db } from '@/lib/db';

interface InviteCodeProps {
  params: {
    inviteCode: string;
  };
}

const InviteCodePage = async ({ params }: InviteCodeProps) => {
  // 初始化用户，防止用户首次进入为此页面
  const profile = await initProfile();

  // 未登录转向登录
  if (!profile) {
    return auth().redirectToSignIn();
  }

  // 无参数转到首页
  if (!params.inviteCode) {
    return redirect('/');
  }

  // 寻找同时含 邀请码 & 用户 的服务器
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

  // 如果用户已经加入了服务器，则直接跳转到该服务器
  if (existServer) {
    return redirect(`/servers/${existServer.id}`);
  }

  // 把未在服务器中的用户加入
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
