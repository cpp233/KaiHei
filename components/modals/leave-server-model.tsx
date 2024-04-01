'use client';
import axios from 'axios';
import { useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

import { useModal } from '@/hooks/use-modal-store';
import { useRouter } from 'next/navigation';

export const LeaveServerModel = () => {
  const { isOpen, onClose, type, data } = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const isModelOpen = isOpen && type === 'leaveServer';
  const { server } = data || { server: null };

  const onClick = async () => {
    try {
      setIsLoading(true);

      await axios.patch(`/api/servers/${server?.id}/leave`);

      onClose();
      router.refresh();
      router.push('/');
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
            离开服务器
          </DialogTitle>
          <DialogDescription className='text-center text-zinc-500'>
            确定退出{' '}
            <span className='font-semibold text-indigo-500'>
              {server?.name}
            </span>{' '}
            ？
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='bg-gray-100 px-6 py-4'>
          <div className='flex items-center justify-between w-full'>
            <Button disabled={isLoading} variant='primary' onClick={onClick}>
              确定
            </Button>
            <Button disabled={isLoading} variant='ghost' onClick={onClose}>
              取消
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
