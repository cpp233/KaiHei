import { currentProfilePages } from '@/lib/current-profile-pages';
import { db } from '@/lib/db';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextApiResponseServerIO } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const profile = await currentProfilePages(req);

    const { content, fileUrl } = req.body;
    const { serverId, channelId } = req.query;

    if (!profile) {
      return res.status(401).json({ error: '未授权' });
    }

    if (!serverId) {
      return res.status(400).json({ error: '缺少服务器 ID' });
    }

    if (!channelId) {
      return res.status(400).json({ error: '缺少频道 ID' });
    }

    if (!content) {
      return res.status(400).json({ error: '内容不能为空' });
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

    const message = await db.message.create({
      data: {
        content,
        fileUrl,
        channelId: channelId as string,
        memberId: member.id,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    const channelKey = `chat:${channelId}:messages`;
    res?.socket?.server?.io?.emit(channelKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.log('[MESSAGES_POST]', error);
    return res.status(500).json({ error: '网络错误' });
  }
}
