import { auth, currentUser } from '@clerk/nextjs/server';

import { db } from '@/lib/db';

export const initProfile = async () => {
  const user = await currentUser();
  // console.log(user);
  if (!user) {
    return auth().redirectToSignIn();
  }

  const profile = await db.profile.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (profile) {
    return profile;
  }

  const newProfile = await db.profile.create({
    data: {
      userId: user.id,
      // name: `${user.firstName} ${user.lastName}`,
      name: `${user.username}`,
      imageUrl: user.imageUrl,
      email: user.emailAddresses[0].emailAddress,
    },
  });

  return newProfile;
};
