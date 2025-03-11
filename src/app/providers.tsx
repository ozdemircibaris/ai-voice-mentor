// app/providers.tsx
"use client";

import { Auth0Provider } from "@auth0/nextjs-auth0";

export function Providers({ children }) {
  return <Auth0Provider>{children}</Auth0Provider>;
}
