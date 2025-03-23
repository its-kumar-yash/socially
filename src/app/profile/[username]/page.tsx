import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProfilePageClient from './ProfilePageClient';
import {
  getProfileByUsername,
  getUserLikedPosts,
  getUserPosts,
  isFollowing,
} from '@/actions/profile.action';

// Define the type for params as a Promise
type ProfilePageParams = Promise<{ username: string }>;

// Dynamic metadata generation
export async function generateMetadata({
  params,
}: {
  params: ProfilePageParams;
}): Promise<Metadata | undefined> {
  const { username } = await params;
  const user = await getProfileByUsername(username);
  if (!user) return;
  return {
    title: `${user.name ?? user.username}`,
    description: user.bio || `Check out ${user.username}'s profile.`,
  };
}

// Server component for the profile page
export default async function ProfilePageServer({
  params,
}: {
  params: ProfilePageParams;
}) {
  const { username } = await params;
  const user = await getProfileByUsername(username);
  if (!user) notFound();
  const [posts, likedPosts, isCurrentUserFollowing] = await Promise.all([
    getUserPosts(user.id),
    getUserLikedPosts(user.id),
    isFollowing(user.id),
  ]);

  return (
    <ProfilePageClient
      user={user}
      posts={posts}
      likedPosts={likedPosts}
      isFollowing={isCurrentUserFollowing}
    />
  );
}
