'use client';
import axios from 'axios';
import { useState } from 'react';
import { Check, Copy, RefreshCcw } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { useModal } from '@/hooks/use-modal-store';
import { useOrigin } from '@/hooks/use-origin';

export const InviteModel = () => {
  const { isOpen, onClose, type, data, onOpen } = useModal();
  const origin = useOrigin();

  const isModelOpen = isOpen && type === 'invite';

  const { server } = data;
  const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onCopy = () => {
    window.navigator.clipboard.writeText(inviteUrl);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  const onNew = async () => {
    try {
      setIsLoading(true);
      const response = await axios.patch(
        `/api/servers/${server?.id}/invite-code`
      );
      onOpen('invite', { server: response.data });
    } catch (error) {
      window.alert('onNew');
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModelOpen} onOpenChange={onClose}>
      <DialogContent className='bg-white text-black p-0 overflow-hidden'>
        <DialogHeader className='pt-8 px-6'>
          <DialogTitle className='text-2xl text-center font-bold'>
            邀请伙伴加入你的服务器
          </DialogTitle>
        </DialogHeader>
        <div className='p-6'>
          <label className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>
            服务器邀请码
          </label>

          <div className='flex items-center mt-2 gap-x-2'>
            <Input
              className='bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0'
              value={inviteUrl}
              disabled={isLoading}
            ></Input>
            <Button size='icon' onClick={onCopy} disabled={isLoading}>
              {copied ? (
                <Check className='w-4 h-4'></Check>
              ) : (
                <Copy className='w-4 h-4'></Copy>
              )}
            </Button>
          </div>

          <Button
            className='text-xs text-zinc-500 mt-4'
            variant='link'
            size='sm'
            disabled={isLoading}
            onClick={onNew}
          >
            重新生成邀请码
            <RefreshCcw className='w-4 h-4 ml-2'></RefreshCcw>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
