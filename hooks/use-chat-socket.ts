import { useSocket } from '@/components/providers/socket-provider';
import { Member, Profile } from '@prisma/client';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

interface ChatSocketProps {
  addKey: string;
  updateKey: string;
  queryKey: string;
}

type MessageWithMemberWithProfile = Member & {
  member: Member & {
    profile: Profile;
  };
};

export const useChatSocket = ({
  addKey,
  updateKey,
  queryKey,
}: ChatSocketProps) => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) {
      return;
    }

    // 更新消息：编辑、删除
    socket.on(updateKey, (message: MessageWithMemberWithProfile) => {
      // 通过 queryClient 手动更新本地消息
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return oldData;
        }

        const newData = oldData.pages.map((page: any) => {
          return {
            ...page,
            items: page.items.map((item: MessageWithMemberWithProfile) => {
              if (item.id === message.id) {
                return message;
              }
              return item;
            }),
          };
        });

        return {
          ...oldData,
          pages: newData,
        };
      });
      // end
    });

    // 发送新消息
    socket.on(addKey, (message: MessageWithMemberWithProfile) => {
      // 通过 queryClient 手动更新本地消息
      queryClient.setQueryData([queryKey], (oldData: any) => {
        console.log('addKey', oldData);
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return {
            pages: [
              {
                items: [message],
              },
            ],
          };
        }

        const newDate = [...oldData.pages];

        newDate[0] = {
          ...newDate[0],
          items: [message, ...newDate[0].items],
        };

        return {
          ...oldData,
          pages: newDate,
        };
      });
      // end
    });

    return () => {
      socket.off(addKey);
      socket.off(updateKey);
      // console.log('卸载');
    };

    // end
  }, [queryClient, socket, addKey, updateKey, queryKey]);
};
