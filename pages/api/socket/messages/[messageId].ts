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

    const { messageId, serverId, channelId } = req.query;
    const { content } = req.body;

    if (!profile) {
      return res.status(401).json({ error: '未授权' });
    }

    if (!serverId) {
      return res.status(400).json({ error: '缺少服务器 ID' });
    }

    if (!channelId) {
      return res.status(400).json({ error: '缺少频道 ID' });
    }

    const server = await db.server.findFirst({
      where: {
        id: serverId as string,
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      include: {
        members: true,
      },
    });
    if (!server) {
      return res.status(404).json({ error: '找不到服务器' });
    }

    const channel = await db.channel.findFirst({
      where: {
        id: channelId as string,
        serverId: serverId as string,
      },
    });
    if (!channel) {
      return res.status(404).json({ error: '找不到频道' });
    }

    const member = server.members.find(
      member => member.profileId === profile.id
    );
    if (!member) {
      return res.status(404).json({ error: '找不到成员' });
    }

    let message = await db.message.findFirst({
      where: {
        id: messageId as string,
        channelId: channelId as string,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!message || message.deleted) {
      return res.status(404).json({ error: '消息未找到' });
    }

    const isMessageOwner = message.memberId === member.id;
    const isAdmin = member.role === MemberRole.ADMIN;
    const isModerator = member.role === MemberRole.MODERATOR;
    const canModify = isMessageOwner || isAdmin || isModerator;

    if (!canModify) {
      return res.status(401).json({ error: '未授权' });
    }

    if (req.method === 'DELETE') {
      message = await db.message.update({
        where: {
          id: messageId as string,
        },
        data: {
          // fileUrl:null,
          // content:'此消息被删除',
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

      message = await db.message.update({
        where: {
          id: messageId as string,
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

    const updateKey = `chat:${channelId}:messages:update`;

    res?.socket?.server?.io?.emit(updateKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.log('[MESSAGES_ID_PATCH_DELETE]', error);
    return res.status(500).json({ error: '网络错误' });
  }
}
