import { NextResponse } from 'next/server';

import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';

export async function PATCH(
  req: Request,
  { params }: { params: { memberId: string } }
) {
  try {
    const profile = await currentProfile();
    const { role } = await req.json();
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get('serverId');

    if (!profile) {
      return new NextResponse('未认证', { status: 401 });
    }

    if (!serverId) {
      return new NextResponse('缺少服务器 ID', { status: 400 });
    }

    if (!params.memberId) {
      return new NextResponse('缺少用户 ID', { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        // 确保拥有者才能修改
        profileId: profile.id,
      },
      data: {
        members: {
          update: {
            where: {
              id: params.memberId,
              profileId: {
                // 不要修改了自己的，后端的保护
                not: profile.id,
              },
            },
            data: { role },
          },
        },
      },
      include: {
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

    return NextResponse.json(server);
  } catch (error) {
    console.log('[MEMBERS_ID_PATCH]', error);

    return new NextResponse('网络错误', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { memberId: string } }
) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get('serverId');

    if (!profile) {
      return new NextResponse('未认证', { status: 401 });
    }

    if (!serverId) {
      return new NextResponse('缺少服务器 ID', { status: 400 });
    }

    if (!params.memberId) {
      return new NextResponse('缺少用户 ID', { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        // 确保拥有者才能修改
        profileId: profile.id,
      },
      data: {
        members: {
          deleteMany: {
            id: params.memberId,
            profileId: {
              // 不要修改了自己的，后端的保护
              not: profile.id,
            },
          },
        },
      },
      include: {
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

    return NextResponse.json(server);
  } catch (error) {
    console.log('[MEMBERS_ID_DELETE]', error);

    return new NextResponse('网络错误', { status: 500 });
  }
}
