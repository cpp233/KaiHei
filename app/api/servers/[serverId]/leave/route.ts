import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse('未认证', { status: 401 });
    }

    if (!params.serverId) {
      return new NextResponse('缺少服务器 ID', { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: params.serverId,
        profileId: {
          // 不能把 创始人 踢出了
          not: profile.id,
        },
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      data: {
        members: {
          deleteMany: {
            profileId: profile.id,
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log('[SERVER_ID_LEAVE]', error);

    return new NextResponse('网络错误', { status: 500 });
  }
}
