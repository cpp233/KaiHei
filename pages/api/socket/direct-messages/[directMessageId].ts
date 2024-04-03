import { currentProfilePages } from '@/lib/current-profile-pages';
import { db } from '@/lib/db';
import { MemberRole } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextApiResponseServerIO } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  if (req.method !== 'DELETE' && req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const profile = await currentProfilePages(req);

    const { directMessageId, conversationId } = req.query;
    const { content } = req.body;

    if (!profile) {
      return res.status(401).json({ error: '未授权' });
    }

    if (!conversationId) {
      return res.status(400).json({ error: '缺少对话 ID' });
    }

    if (!directMessageId) {
      return res.status(400).json({ error: '缺少私人消息 ID' });
    }

    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId as string,
        OR: [
          {
            memberOne: {
              profileId: profile.id,
            },
          },
          {
            memberTwo: {
              profileId: profile.id,
            },
          },
        ],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });
    if (!conversation) {
      return res.status(404).json({ error: '找不到对话' });
    }

    const member =
      conversation.memberOne.profileId === profile.id
        ? conversation.memberOne
        : conversation.memberTwo;
    if (!member) {
      return res.status(404).json({ error: '找不到成员' });
    }

    let directMessage = await db.directMessage.findFirst({
      where: {
        id: directMessageId as string,
        conversationId: conversationId as string,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!directMessage || directMessage.deleted) {
      return res.status(404).json({ error: '消息未找到' });
    }

    const isMessageOwner = directMessage.memberId === member.id;
    const isAdmin = member.role === MemberRole.ADMIN;
    const isModerator = member.role === MemberRole.MODERATOR;
    const canModify = isMessageOwner || isAdmin || isModerator;

    if (!canModify) {
      return res.status(401).json({ error: '未授权' });
    }

    if (req.method === 'DELETE') {
      directMessage = await db.directMessage.update({
        where: {
          id: directMessageId as string,
        },
        data: {
          fileUrl: null,
          content: '此消息被删除',
          deleted: true,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }

    if (req.method === 'PATCH') {
      // 为了人文关怀，应该只允许本人修改自己的消息。
      if (!isMessageOwner) {
        return res.status(401).json({ error: '未授权' });
      }

      directMessage = await db.directMessage.update({
        where: {
          id: directMessageId as string,
        },
        data: {
          content: content,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }

    const updateKey = `chat:${conversation.id}:messages:update`;

    res?.socket?.server?.io?.emit(updateKey, directMessage);

    return res.status(200).json(directMessage);
  } catch (error) {
    console.log('[MESSAGES_ID_PATCH_DELETE]', error);
    return res.status(500).json({ error: '网络错误' });
  }
}
