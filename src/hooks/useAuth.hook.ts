"use client";

import { useState, useEffect } from "react";
import { useUser as useAuth0User } from "@auth0/nextjs-auth0";

export function useAuth() {
  const { user: auth0User, error: auth0Error, isLoading: auth0Loading } = useAuth0User();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Only fetch the user data if Auth0 has authenticated the user
    if (auth0User && !auth0Loading) {
      fetch("/api/user")
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch user data");
          return res.json();
        })
        .then((data) => {
          setUser(data.user);
          setIsLoading(false);
        })
        .catch((err) => {
          setError(err);
          setIsLoading(false);
        });
    } else if (!auth0Loading) {
      // Auth0 loading is complete, but no user
      setIsLoading(false);
    }
  }, [auth0User, auth0Loading]);

  return {
    user, // The full user data from your database
    auth0User, // The Auth0 user object
    isLoading: isLoading || auth0Loading,
    error: error || auth0Error,
  };
}
