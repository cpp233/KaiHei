import { db } from '@/lib/db';

const findConversation = async (memberOneId: string, memberTwoId: string) => {
  return await db.conversation.findFirst({
    where: {
      AND: [{ memberOneId: memberOneId, memberTwoId: memberTwoId }],
    },
  });
};
