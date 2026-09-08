import { auth } from '@/lib/auth/server';
import Link from 'next/link';

// Server components using auth methods must be rendered dynamically
export const dynamic = 'force-dynamic';

export default async function Home() {
  const { data: session } = await auth.getSession();

  if (session?.user) {
    return (
      <div className="flex flex-col gap-2 min-h-screen items-center justify-center">
        <h1 className="mb-4 text-4xl">
          Hello, <span className="font-bold underline">{session.user.name}</span>
        </h1>
        <p>
          This is where you can edit content on the website
        </p>
        <h2 className="mb-4 text-2xl">
          Edit Shows
        </h2>
        <h2 className="mb-4 text-2xl">
          Edit Artists
        </h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 min-h-screen items-center justify-center">
      <h1 className="mb-4 text-4xl font-bold">Not logged in</h1>
      <div className="flex item-center gap-2">
        <Link
          href="/admin/sign-in"
          className="inline-flex text-lg text-indigo-400 hover:underline"
        >
          Sign-in
        </Link>
      </div>
    </div>
  );
}