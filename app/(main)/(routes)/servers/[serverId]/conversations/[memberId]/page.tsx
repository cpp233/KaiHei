import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { getOrCreateConversation } from '@/lib/conversation';
import ChatHeader from '@/components/chat/chat-header';
import ChatMessages from '@/components/chat/chat-messages';
import ChatInput from '@/components/chat/chat-input';
import { WS_URL_DIRECT_MESSAGE } from '@/lib/getEnv';
import { MediaRoom } from '@/components/media-room';

interface MemberIdPageProps {
  params: {
    memberId: string;
    serverId: string;
  };
  searchParams: {
    video?: boolean;
  };
}

const MemberIdPage = async ({ params, searchParams }: MemberIdPageProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return auth().redirectToSignIn();
  }

  const currentMember = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
    include: {
      profile: true,
    },
  });

  if (!currentMember) {
    return redirect('/');
  }

  const conversation = await getOrCreateConversation(
    currentMember.id,
    params.memberId
  );

  if (!conversation) {
    return redirect(`/servers/${params.serverId}`);
  }

  const { memberOne, memberTwo } = conversation;

  // 找出谁是被点击者
  const otherMember =
    memberOne.profileId === profile.id ? memberTwo : memberOne;

  return (
    <div className='bg-white dark:bg-[#313338] flex flex-col h-full'>
      <ChatHeader
        imageUrl={otherMember.profile.imageUrl}
        name={otherMember.profile.name}
        serverId={params.serverId}
        type='conversation'
      ></ChatHeader>
      {/* 常规 */}
      {!searchParams.video && (
        <>
          <ChatMessages
            member={currentMember}
            name={otherMember.profile.name}
            chatId={conversation.id}
            type='conversation'
            apiUrl='/api/direct-messages'
            paramKey='conversationId'
            paramValue={conversation.id}
            socketUrl={WS_URL_DIRECT_MESSAGE}
            socketQuery={{
              conversationId: conversation.id,
            }}
          ></ChatMessages>
          <ChatInput
            name={otherMember.profile.name}
            type='conversation'
            apiUrl={WS_URL_DIRECT_MESSAGE}
            query={{
              conversationId: conversation.id,
            }}
          ></ChatInput>
        </>
      )}
      {/* 流媒体 */}
      {searchParams.video && (
        <MediaRoom
          chatId={conversation.id}
          isAudio={true}
          isVideo={true}
        ></MediaRoom>
      )}
    </div>
  );
};

export default MemberIdPage;
