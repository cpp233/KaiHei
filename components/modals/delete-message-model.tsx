'use client';
import axios from 'axios';
import { useState } from 'react';
import qs from 'query-string';

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

export const DeleteMessageModel = () => {
  const { isOpen, onClose, type, data } = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const isModelOpen = isOpen && type === 'deleteMessage';

  if (!data) {
    return null;
  }

  const apiUrl = data?.apiUrl;
  const query = data?.query;

  const onClick = async () => {
    try {
      setIsLoading(true);
      const url = qs.stringifyUrl({
        url: apiUrl || '',
        query: query,
      });

      await axios.delete(url);

      onClose();
      // router.refresh();
      // router.push(`/servers/${server?.id}`);
    } catch (error) {
      window.alert('DeleteMessageModel.onClick');
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
            删除消息
          </DialogTitle>
          <DialogDescription className='text-center text-zinc-500'>
            确定删除此条消息吗？
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
