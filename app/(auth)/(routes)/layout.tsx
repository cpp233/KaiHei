// import React from 'react';

// 注意不要使用成 export const ...
// export const AuthLayout = ({ children }: { children: React.ReactNode }) =>
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='h-full flex items-center justify-center'>{children}</div>
  );
}
