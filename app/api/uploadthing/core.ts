import { auth } from '@clerk/nextjs/server';
import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { UploadThingError } from 'uploadthing/server';

const f = createUploadthing();

// const auth = (req: Request) => ({ id: 'fakeId' }); // Fake auth function

const handleAuth = () => {
  // const auth2 = auth();
  const { userId } = auth();

  if (!userId) {
    throw new Error('未认证');
  }
  return { userId: userId };
};

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  serverImage: f({
    image: { maxFileSize: '4MB', maxFileCount: 1 },
  })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),

  messageFile: f(['image', 'pdf'])
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
// export type =

// 导出 ourFileRouter 的 key
export type OurFileRouterKeys = keyof OurFileRouter;
