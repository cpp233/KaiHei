'use client';

import { Plus } from 'lucide-react';

import { ActionToolTip } from '@/components/action-tooltip';
import { useModal } from '@/hooks/use-modal-store';

export const NavigationAction = () => {
  const { onOpen } = useModal();

  return (
    <div>
      <ActionToolTip side='right' align='center' label='新增服务器'>
        <button
          className='group flex items-center'
          onClick={() => onOpen('createServer')}
        >
          <div className='flex items-center justify-center mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden bg-background dark:bg-neutral-700 group-hover:bg-emerald-500'>
            <Plus
              className='group-hover:text-white transition text-emerald-500'
              size={25}
            ></Plus>
          </div>
        </button>
      </ActionToolTip>
    </div>
  );
};
