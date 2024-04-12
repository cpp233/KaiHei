import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { DirectMessage, Message } from '@prisma/client';
import { NextResponse } from 'next/server';
import { MESSAGE_BATCH } from '@/lib/getEnv';
// import { URL } from 'node:url';

export async function GET(req: Request) {
  try {
    const profile = await currentProfile();

    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get('cursor');
    const conversationId = searchParams.get('conversationId');

    if (!profile) {
      return new NextResponse('未授权', { status: 401 });
    }

    if (!conversationId) {
      return new NextResponse('缺少对话 ID', { status: 400 });
    }

    let messages: DirectMessage[] = [];

    if (cursor) {
      // 有 cursor ，则代表寻找 cursor 后面的消息
      messages = await db.directMessage.findMany({
        take: MESSAGE_BATCH,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          conversationId,
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
      messages = await db.directMessage.findMany({
        take: MESSAGE_BATCH,
        where: {
          conversationId: conversationId,
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
    console.log('[DIRECT_MESSAGE_GET]', error);

    return new NextResponse('网络错误', { status: 500 });
  }
}
