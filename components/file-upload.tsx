'use client';
import { X } from 'lucide-react';
import Image from 'next/image';
import { UploadDropzone } from '@/lib/uploadthing';
import type { OurFileRouterKeys } from '@/app/api/uploadthing/core';

import '@uploadthing/react/styles.css';

interface FileUploadProps {
  // endpoint: 'messageFile' | 'serverImage';
  endpoint: OurFileRouterKeys;
  value: string;
  onChange: (url?: string) => void;
}

export const FileUpload = ({ endpoint, value, onChange }: FileUploadProps) => {
  const fileType = value?.split('.').pop();

  // 检测结果，则提前截断
  if (value && fileType !== 'pdf') {
    return (
      <div className='relative h-20 w-20'>
        <Image
          fill
          src={value}
          alt='上传图片'
          className='rounded-full border-2 border-gray-200 shadow-md'
        ></Image>
        <button
          onClick={() => onChange('')}
          className='bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm'
          type='button'
        >
          <X className='h-4 w-4'></X>
        </button>
      </div>
    );
  }

  return (
    <UploadDropzone
      className=''
      endpoint={endpoint}
      onClientUploadComplete={res => {
        onChange(res[0]?.url);
      }}
      onUploadError={(error: Error) => {
        window.alert('onUploadError');
        console.error(error);
      }}
    ></UploadDropzone>
  );
};
