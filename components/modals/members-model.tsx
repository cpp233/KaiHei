'use client';
import axios from 'axios';
import { useState } from 'react';
import {
  MoreVertical,
  ShieldCheck,
  ShieldQuestion,
  Shield,
  Check,
  Gavel,
  Loader2,
} from 'lucide-react';
import { MemberRole } from '@prisma/client';
import qs from 'query-string';
import { useRouter } from 'next/navigation';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';

import { ScrollArea } from '@/components/ui/scroll-area';
import UserAvatar from '@/components/user-avatar';

import { useModal } from '@/hooks/use-modal-store';

const roleIconMap = {
  [MemberRole.ADMIN]: (
    <ShieldCheck className='h-4 w-4 ml=2 text-indigo-500'></ShieldCheck>
  ),
  [MemberRole.MODERATOR]: (
    <ShieldCheck className='h-4 w-4 ml=2 text-rose-500'></ShieldCheck>
  ),
  [MemberRole.GUEST]: null,
};

export const MembersModel = () => {
  const { isOpen, onClose, type, data, onOpen } = useModal();
  const [loadingId, setLoadingId] = useState('');
  const router = useRouter();

  const isModelOpen = isOpen && type === 'manageMembers';

  const { server } = data || { server: null };

  const onRoleChange = async (memberId: string, role: MemberRole) => {
    try {
      setLoadingId(memberId);

      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?.id,
          // memberId,
        },
      });

      const response = await axios.patch(url, { role });
      router.refresh();
      onOpen('manageMembers', { server: response.data });
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId('');
    }
  };

  const onKick = async (memberId: string) => {
    try {
      setLoadingId(memberId);

      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?.id,
        },
      });

      const response = await axios.delete(url);
      router.refresh();
      onOpen('manageMembers', { server: response.data });
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId('');
    }
  };

  return (
    <Dialog open={isModelOpen} onOpenChange={onClose}>
      <DialogContent className='bg-white text-black p-0 overflow-hidden'>
        <DialogHeader className='pt-8 px-6'>
          <DialogTitle className='text-2xl text-center font-bold'>
            管理此服务器成员
          </DialogTitle>
          <DialogDescription className='text-center text-zinc-500'>
            {server?.members.length} 个成员
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className='mt-8 max-h-[420px] pr-6'>
          {server?.members.map(member => (
            <div key={member.id} className='flex items-center gap-x-2 mb-6'>
              {/* 头像 */}
              <UserAvatar src={member.profile.imageUrl}></UserAvatar>
              {/* 用户信息 */}
              <div className='flex flex-col gap-y-1'>
                <div className='text-xs font-semibold flex items-center gap-x-1'>
                  {member.profile.name}
                  {roleIconMap[member.role]}
                </div>
                <p className='text-xs text-zinc-500'>{member.profile.email}</p>
              </div>
              {/* action */}
              {server.profileId !== member.profileId &&
                loadingId !== member.id && (
                  <div className='ml-auto'>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreVertical className='h-4 w-5 text-zinc-500'></MoreVertical>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side='left'>
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger className='flex items-center'>
                            <ShieldQuestion className='w-4 h-4 mr-2'></ShieldQuestion>
                            <span>权限</span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              <DropdownMenuItem
                                onClick={() =>
                                  onRoleChange(member.id, MemberRole.GUEST)
                                }
                              >
                                <Shield className='h-4 w-4 mr-2'></Shield>
                                {MemberRole.GUEST && '游客'}
                                {member.role === MemberRole.GUEST && (
                                  <Check className='h-4 w-4 ml-auto'></Check>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  onRoleChange(member.id, MemberRole.ADMIN)
                                }
                              >
                                <ShieldCheck className='h-4 w-4 mr-2'></ShieldCheck>
                                {MemberRole.MODERATOR && '版主'}
                                {member.role === MemberRole.MODERATOR && (
                                  <Check className='h-4 w-4 ml-auto'></Check>
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>

                        <DropdownMenuSeparator></DropdownMenuSeparator>

                        <DropdownMenuItem onClick={() => onKick(member.id)}>
                          <Gavel className='h-4 w-4 mr-2'></Gavel>
                          踢出
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}

              {/*  */}
              {loadingId === member.id && (
                <Loader2 className='animate-spin text-zinc-500 ml-auto w-4 h-4'></Loader2>
              )}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
