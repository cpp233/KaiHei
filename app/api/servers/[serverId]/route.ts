import { NextResponse } from 'next/server';
import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();
    const { name, imageUrl } = await req.json();

    if (!profile) {
      return new NextResponse('未认证', { status: 401 });
    }

    const server = await db.server.update({
      where: {
        id: params.serverId,
        // 确保拥有者才能修改
        profileId: profile.id,
      },
      data: {
        name,
        imageUrl,
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log('[SERVER_PATCH]', error);

    return new NextResponse('网络错误', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse('未认证', { status: 401 });
    }

    const server = await db.server.delete({
      where: {
        id: params.serverId,
        // 确保拥有者才能修改
        profileId: profile.id,
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log('[SERVER_DELETE]', error);

    return new NextResponse('网络错误', { status: 500 });
  }
}
