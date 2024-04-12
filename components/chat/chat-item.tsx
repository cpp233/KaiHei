'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Member, MemberRole, Profile } from '@prisma/client';
import { Edit, FileIcon, ShieldAlert, ShieldCheck, Trash } from 'lucide-react';
import * as z from 'zod';
import qs from 'query-string';

import { cn } from '@/lib/utils';
import UserAvatar from '@/components/user-avatar';
import { ActionToolTip } from '@/components/action-tooltip';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useModal } from '@/hooks/use-modal-store';
import { useParams, useRouter } from 'next/navigation';

interface ChatItemProps {
  id: string;
  content: string;
  member: Member & {
    profile: Profile;
  };
  timestamp: string;
  deleted: boolean;
  fileUrl: string | null;
  currentMember: Member;
  isUpdated: boolean;
  timestampUpdated: string;
  socketUrl: string;
  socketQuery: Record<string, string>;
}

const roleIconMap = {
  [MemberRole.ADMIN]: (
    <ShieldAlert className='h-4 w-4 ml-2 text-rose-500'></ShieldAlert>
  ),
  [MemberRole.MODERATOR]: (
    <ShieldCheck className='h-4 w-4 ml-2 text-indigo-500'></ShieldCheck>
  ),
  [MemberRole.GUEST]: null,
};

const roleNameMap = {
  [MemberRole.ADMIN]: '管理员',
  [MemberRole.MODERATOR]: '版主',
  [MemberRole.GUEST]: '游客',
};

const formSchema = z.object({
  content: z.string().min(1),
});

const ChatItem = ({
  id,
  content,
  member,
  timestamp,
  fileUrl,
  deleted,
  currentMember,
  isUpdated,
  timestampUpdated,
  socketUrl,
  socketQuery,
}: ChatItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const message_url = `${socketUrl}/${id}`;
  const { onOpen } = useModal();
  const params = useParams();
  const router = useRouter();

  const onMemberClick = () => {
    if (member.id === currentMember.id) {
      return;
    }

    router.push(`/servers/${params?.serverId}/conversations/${member.id}`);
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: content,
    },
  });
  const isLoading = form.formState.isSubmitting;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: message_url,
        query: socketQuery,
      });

      await axios.patch(url, values);

      form.reset();
      setIsEditing(false);
    } catch (error) {
      console.log(error);
    }
  };

  // 监听 content 变化
  useEffect(() => {
    form.reset({ content: content });
  }, [content, form]);

  // 监听按键
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' || event.keyCode === 27) {
        setIsEditing(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // 权限确认
  const isAdmin = currentMember.role === MemberRole.ADMIN;
  const isModerator = currentMember.role === MemberRole.MODERATOR;
  const isOwner = currentMember.id === member.id;

  // 消息控制
  const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);
  // 为了人文关怀，应该只允许本人修改自己的消息。
  const canEditMessage = !deleted && isOwner && !fileUrl;

  // 消息类型确认
  const fileType = fileUrl?.split('.').pop();
  const isPDF = fileType === 'pdf' && fileUrl;
  // 此处待扩展更多格式
  const isImage = !isPDF && fileUrl;

  return (
    <div className='relative group flex items-center hover:bg-black/5 p-4 transition w-full'>
      <div className='group flex gpa-x-2 items-start w-full'>
        {/* 头像 */}
        <div
          className='cursor-pointer hover:drop-shadow-md transition'
          onClick={onMemberClick}
        >
          <UserAvatar src={member.profile.imageUrl}></UserAvatar>
        </div>
        {/* 正文 */}
        <div className='flex flex-col w-full'>
          {/* 信息 */}
          <div className='flex items-center gap-x-2'>
            {/* 用户名 */}
            <div className='flex items-center'>
              <p className='font-semibold text-sm hover:underline cursor-pointer'>
                {member.profile.name}
              </p>
              <ActionToolTip label={roleNameMap[member.role]}>
                {roleIconMap[member.role]}
              </ActionToolTip>
            </div>
            {/* 时间 */}
            <span className='text-xs text-zinc-500 dark:text-zinc-400'>
              {timestamp}
            </span>
          </div>
          {/* 内容 */}
          {isImage && (
            <a
              href={fileUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48'
            >
              <Image
                src={fileUrl}
                alt={content}
                fill
                className='object-cover'
              ></Image>
            </a>
          )}
          {isPDF && (
            <div className='relative flex items-center p-2 mt-2 rounded-md bg-background/10'>
              <FileIcon className='h-10 w-10 fill-indigo-200 stroke-indigo-400'></FileIcon>
              <a
                href={fileUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline'
              >
                PDF文件
              </a>
            </div>
          )}
          {!fileUrl && !isEditing && (
            <p
              className={cn(
                'text-sm text-zinc-600 dark:text-zinc-300',
                deleted &&
                  'italic text-zinc-500 dark:text-zinc-400 text-xs mt-1'
              )}
            >
              {content}
              {isUpdated && !deleted && (
                <ActionToolTip
                  label={timestampUpdated ? `编辑于:${timestampUpdated}` : ''}
                >
                  <span className='text-[10px] mx-2 text-zinc-500 dark:text-zinc-400'>
                    (已编辑)
                  </span>
                </ActionToolTip>
              )}
            </p>
          )}
          {/* 进入编辑状态 */}
          {!fileUrl && isEditing && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='flex items-center w-full gap-x-2 pt-2'
              >
                <FormField
                  control={form.control}
                  name='content'
                  render={({ field }) => (
                    <FormItem className='flex-1'>
                      <FormControl>
                        <div className='relative w-full'>
                          <Input
                            className='p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200'
                            placeholder='编辑消息'
                            disabled={isLoading}
                            {...field}
                          ></Input>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                ></FormField>
                <Button disabled={isLoading} size='sm' variant='primary'>
                  保存
                </Button>
              </form>
              <span className='text-[10px] mt-1 text-zinc-400'>
                按 esc 退出，按回车(enter)保存
              </span>
            </Form>
          )}
        </div>
        {/*  */}
      </div>
      {canDeleteMessage && (
        <div className='hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm'>
          {canEditMessage && (
            <ActionToolTip label='编辑'>
              <Edit
                className='cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition'
                onClick={() => setIsEditing(true)}
              ></Edit>
            </ActionToolTip>
          )}
          <ActionToolTip label='删除'>
            <Trash
              className='cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition'
              onClick={() =>
                onOpen('deleteMessage', {
                  apiUrl: message_url,
                  query: socketQuery,
                })
              }
            ></Trash>
          </ActionToolTip>
        </div>
      )}
    </div>
  );
};

export default ChatItem;
