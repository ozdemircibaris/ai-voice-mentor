// components/user-profile.tsx
"use client";

import { useUser } from "@auth0/nextjs-auth0";
import { LoginButton } from "./auth-buttons";

export function UserProfile() {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  if (!user) {
    return (
      <div>
        <p>Not logged in</p>
        <LoginButton />
      </div>
    );
  }

  return (
    <div>
      {/* // eslint-disable-next-line @next/next/no-img-element */}
      <img src={user.picture} alt={user.name} width={50} height={50} />
      <div>
        <h2>{user.name}</h2>
        <p>{user.email}</p>
      </div>
    </div>
  );
}
