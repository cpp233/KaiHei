import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { initProfile } from '@/lib/init-profile';

const SetupPage = async () => {
  const profile = await initProfile();

  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (server) {
    return redirect(`/servers/${server.id}`);
  }

  return <div>等待创建服务器</div>;
};

export default SetupPage;
