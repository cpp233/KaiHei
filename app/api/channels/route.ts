import { NextResponse } from 'next/server';

import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { MemberRole } from '@prisma/client';
import { DEFAULT_CHANNEL } from '@/lib/getEnv';

export async function POST(req: Request) {
  try {
    const profile = await currentProfile();
    const { name, type } = await req.json();
    const { searchParams } = new URL(req.url);

    const serverId = searchParams.get('serverId');

    if (!profile) {
      return new NextResponse('未授权', { status: 401 });
    }

    if (!serverId) {
      return new NextResponse('缺少服务器 ID', { status: 400 });
    }

    if (name === DEFAULT_CHANNEL) {
      return new NextResponse(`频道名称不能为 "${DEFAULT_CHANNEL}"`, {
        status: 400,
      });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          create: {
            profileId: profile.id,
            name,
            type,
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log('[CHANNEL_POST]', error);

    return new NextResponse('网络错误', { status: 500 });
  }
}
