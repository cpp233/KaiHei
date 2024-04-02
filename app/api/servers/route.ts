// 导入加密库
import crypto from 'crypto';

import { NextResponse } from 'next/server';
import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { MemberRole } from '@prisma/client';
import { DEFAULT_CHANNEL } from '@/lib/getEnv';

export async function POST(req: Request) {
  try {
    const { name, imageUrl } = await req.json();
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse('未授权', { status: 401 });
    }

    const uuid = crypto.randomUUID();

    const server = await db.server.create({
      data: {
        profileId: profile.id,
        name,
        imageUrl,
        inviteCode: uuid,
        channels: {
          create: {
            name: DEFAULT_CHANNEL,
            profileId: profile.id,
          },
        },
        members: {
          create: [
            {
              profileId: profile.id,
              role: MemberRole.ADMIN,
            },
          ],
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log('[SERVER_POST]', error);

    return new NextResponse('网络错误', { status: 500 });
  }
}
