import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { Message } from '@prisma/client';
import { NextResponse } from 'next/server';
import { MESSAGE_BATCH } from '@/lib/getEnv';

export async function GET(req: Request) {
  try {
    const profile = await currentProfile();

    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get('cursor');
    const channelId = searchParams.get('channelId');

    if (!profile) {
      return new NextResponse('未授权', { status: 401 });
    }

    if (!channelId) {
      return new NextResponse('缺少频道 ID', { status: 400 });
    }

    let messages: Message[] = [];

    if (cursor) {
      // 有 cursor ，则代表寻找 cursor 后面的消息
      messages = await db.message.findMany({
        take: MESSAGE_BATCH,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          channelId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc', // 反向接收，符合习惯
        },
      });
    } else {
      // 无 cursor 说明没传参数，传送最新消息。
      messages = await db.message.findMany({
        take: MESSAGE_BATCH,
        where: {
          channelId: channelId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc', // 反向接收，符合习惯
        },
      });
    }

    // 把 nextCursor 传过去，当下一次的
    let nextCursor = null;
    if (messages.length === MESSAGE_BATCH) {
      nextCursor = messages[MESSAGE_BATCH - 1].id;
    }

    return NextResponse.json({
      items: messages,
      nextCursor,
    });
  } catch (error) {
    console.log('[MESSAGES_GET]', error);

    return new NextResponse('网络错误', { status: 500 });
  }
}
