import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { initProfile } from '@/lib/init-profile';
import { InitModel } from '@/components/modals/init-model';

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

  return <InitModel></InitModel>;
};

export default SetupPage;
