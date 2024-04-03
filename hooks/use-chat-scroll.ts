import { useEffect, useState } from 'react';

type ChatScrollProps = {
  chatRef: React.RefObject<HTMLDivElement>;
  bottomRef: React.RefObject<HTMLDivElement>;
  shouldLoadMore: boolean;
  loadMore: () => void;
  count: number;
};

export const useChatScroll = ({
  chatRef,
  bottomRef,
  shouldLoadMore,
  loadMore,
  count,
}: ChatScrollProps) => {
  const [hasInit, setHasInit] = useState(false);

  // 增加滚动到顶部事件
  useEffect(() => {
    const topDiv = chatRef?.current;

    const handleScroll = () => {
      const scrollTop = topDiv?.scrollTop;

      if (scrollTop === 0 && shouldLoadMore) {
        loadMore();
      }
    };
    topDiv?.addEventListener('scroll', handleScroll);
    return () => {
      topDiv?.removeEventListener('scroll', handleScroll);
    };

    //
  }, [shouldLoadMore, loadMore, chatRef]);

  useEffect(() => {
    const bottomDiv = bottomRef?.current;
    const topDiv = chatRef?.current;

    const shouldAutoScroll = () => {
      // 第一次进入页面的时候滚动到最新消息
      if (!hasInit && bottomDiv) {
        setHasInit(true);
        return true;
      }

      if (!topDiv) {
        return false;
      }

      // 监听消息，如果两者靠得很近，也滚动到最新消息
      const distanceFromBottom =
        topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight;
      return distanceFromBottom <= 100;
    };

    if (shouldAutoScroll()) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }

    //
  }, [bottomRef, chatRef, count, hasInit]);
};
