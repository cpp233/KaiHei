import { NextResponse } from 'next/server';
import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { MemberRole } from '@prisma/client';
import { DEFAULT_CHANNEL } from '@/lib/getEnv';

export async function PATCH(
  req: Request,
  { params }: { params: { channeId: string } }
) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);
    const { name, type } = await req.json();

    const serverId = searchParams.get('serverId');
    const channelId = params?.channeId;

    if (!profile) {
      return new NextResponse('未认证', { status: 401 });
    }

    if (!serverId) {
      return new NextResponse('缺少服务器 ID', { status: 400 });
    }

    if (!channelId) {
      return new NextResponse('缺少频道 ID', { status: 400 });
    }

    // 保护
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
            // 鉴权
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          update: {
            where: {
              id: channelId,
              name: {
                // 服务端保护
                not: DEFAULT_CHANNEL,
              },
            },
            data: {
              name,
              type,
            },
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log('[CHANNEL_ID_PATCH]', error);

    return new NextResponse('网络错误', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { channeId: string } }
) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);

    const serverId = searchParams.get('serverId');
    const channelId = params?.channeId;

    if (!profile) {
      return new NextResponse('未认证', { status: 401 });
    }

    if (!serverId) {
      return new NextResponse('缺少服务器 ID', { status: 400 });
    }

    if (!channelId) {
      return new NextResponse('缺少频道 ID', { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            // 鉴权
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          delete: {
            id: channelId,
            name: {
              // 服务端保护
              not: DEFAULT_CHANNEL,
            },
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log('[CHANNEL_ID_DELETE]', error);

    return new NextResponse('网络错误', { status: 500 });
  }
}
