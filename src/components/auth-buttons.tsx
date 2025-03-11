// components/auth-buttons.tsx
import Link from "next/link";

export function LoginButton() {
  return <Link href="/api/auth/login">Log In</Link>;
}

export function LogoutButton() {
  return <Link href="/api/auth/logout">Log Out</Link>;
}
