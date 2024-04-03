'use client';

import { Search } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { match } from 'pinyin-pro';
import throttle from 'lodash/throttle';
import { useParams, useRouter } from 'next/navigation';

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

interface ServerSearchProps {
  data: {
    label: string;
    type: 'channel' | 'member';
    data:
      | {
          icon: React.ReactNode;
          name: string;
          id: string;
        }[]
      | undefined;
  }[];
}

type SearchType = (
  value: string,
  search: string,
  keywords?: string[] | undefined
) => number;

const ServerSearch = ({ data }: ServerSearchProps) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(open => !open);
      }
    };
    document.addEventListener('keydown', down);

    return () => {
      document.removeEventListener('keydown', down);
    };
  }, []);

  const onClick = ({
    id,
    type,
  }: {
    id: string;
    type: 'channel' | 'member';
  }) => {
    setOpen(false);

    if (type === 'member') {
      return router.push(`/server/${params?.serverId}/conversations/${id}`);
    }

    if (type === 'channel') {
      return router.push(`/server/${params?.serverId}/channels/${id}`);
    }
  };

  const handleSearch1: SearchType = (value, search, keywords) => {
    const matchArr = match(value, search, {
      precision: 'start',
    });
    console.log(value, search, keywords, matchArr);

    return matchArr?.length / value?.length;
  };
  const handleSearch2 = throttle<SearchType>(handleSearch1, 100);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className='group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition'
      >
        <Search className='w-4 h-4 text-zinc-500 dark:text-zinc-400'></Search>
        <p className='font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition'>
          搜索
        </p>
        <kbd className='pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-auto'>
          <span className='text-xs'>⌘</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        {/* 中文拼音搜索 */}
        <Command filter={handleSearch1}>
          <CommandInput placeholder='搜索频道和成员'></CommandInput>
          <CommandList>
            <CommandEmpty>无结果</CommandEmpty>
            {data.map(({ label, type, data }) => {
              if (!data?.length) {
                return null;
              }
              return (
                <CommandGroup key={label} heading={label}>
                  {data.map(({ id, icon, name }) => {
                    return (
                      <CommandItem
                        key={id}
                        onSelect={() => onClick({ id, type })}
                      >
                        {icon}
                        <span>{name}</span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              );
            })}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
};

export default ServerSearch;
