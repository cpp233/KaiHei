'use client';
import { Fragment, useRef, ElementRef } from 'react';
import { useChatQuery } from '@/hooks/use-chat-query';
import { Member, Message, Profile } from '@prisma/client';
import { Loader2, ServerCrash } from 'lucide-react';
import { format } from 'date-fns';

import ChatWelcome from './chat-welcome';
import ChatItem from './chat-item';
import { useChatSocket } from '@/hooks/use-chat-socket';
import { useChatScroll } from '@/hooks/use-chat-scroll';

const DATE_FORMAT = 'yyyy-MM-dd HH:mm:ss';

interface ChatMessagesProps {
  name: string;
  member: Member;
  chatId: string;
  apiUrl: string;
  socketUrl: string;
  socketQuery: Record<string, string>;
  paramKey: 'channelId' | 'conversationId';
  paramValue: string;
  type: 'channel' | 'conversation';
}

type MessageWithMemberWithProfile = Message & {
  member: Member & {
    profile: Profile;
  };
};

const ChatMessages = ({
  name,
  member,
  chatId,
  apiUrl,
  socketUrl,
  socketQuery,
  paramKey,
  paramValue,
  type,
}: ChatMessagesProps) => {
  const queryKey = `chat:${chatId}`;
  const addKey = `chat:${chatId}:messages`;
  const updateKey = `chat:${chatId}:messages:update`;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({
      queryKey,
      apiUrl,
      paramKey,
      paramValue,
    });

  useChatSocket({ queryKey, addKey, updateKey });

  const chatRef = useRef<ElementRef<'div'>>(null);
  const bottomRef = useRef<ElementRef<'div'>>(null);
  useChatScroll({
    chatRef,
    bottomRef,
    loadMore: fetchNextPage,
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
    count: data?.pages?.[0]?.items?.length ?? 0,
  });

  if (status === 'pending') {
    return (
      <div className='flex flex-col flex-1 justify-center items-center'>
        <Loader2 className='h-7 w-7 text-zinc-500 animate-spin my-4'></Loader2>
        <p className='text-xs text-zinc-500 dark:text-zinc-400'>载入中...</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className='flex flex-col flex-1 justify-center items-center'>
        <ServerCrash className='h-7 w-7 text-zinc-500 my-4'></ServerCrash>
        <p className='text-xs text-zinc-500 dark:text-zinc-400'>出错了！</p>
      </div>
    );
  }

  return (
    <div className='flex-1 flex flex-col py-4 overflow-y-auto' ref={chatRef}>
      {/* 没有更多内容，则渲染这个标签 */}
      {!hasNextPage && (
        <>
          <div className='flex-1'></div>
          <ChatWelcome name={name} type={type}></ChatWelcome>
        </>
      )}

      {/* 如果有，则会显示 Loading 动画，并加载 */}
      {hasNextPage && (
        <div className='flex justify-center'>
          {isFetchingNextPage ? (
            <Loader2 className='h-6 w-6 text-zinc-500 animate-spin my-4'></Loader2>
          ) : (
            <button
              className='text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 text-xs my-4 dark:hover:text-zinc-300 transition'
              onClick={() => fetchNextPage()}
            >
              加载更多消息
            </button>
          )}
        </div>
      )}

      <div className='flex flex-col-reverse mt-auto'>
        {data?.pages.map((group, index) => (
          <Fragment key={index}>
            {group.items.map((message: MessageWithMemberWithProfile) => (
              <ChatItem
                key={message.id}
                id={message.id}
                currentMember={member}
                member={message.member}
                content={message.content}
                fileUrl={message.fileUrl}
                deleted={message.deleted}
                timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                isUpdated={message.updatedAt !== message.createdAt}
                timestampUpdated={format(
                  new Date(message.updatedAt),
                  DATE_FORMAT
                )}
                socketUrl={socketUrl}
                socketQuery={socketQuery}
              ></ChatItem>
            ))}
          </Fragment>
        ))}
      </div>
      <div ref={bottomRef}></div>
    </div>
  );
};

export default ChatMessages;
