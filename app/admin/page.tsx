import { auth } from '@/lib/auth/server';
import Link from 'next/link';
import { EditModeCheckbox } from './EditModeCheckbox';

// Server components using auth methods must be rendered dynamically
export const dynamic = 'force-dynamic';

export default async function Home() {
  const { data: session } = await auth.getSession();

  if (session?.user) {
    return (
      <div className="flex min-h-[75svh] my-auto w-full items-center justify-center px-5 py-16 text-white">
        <section className="mt-9 w-full max-w-lg rounded-2xl border border-white/15 bg-white/[0.03] p-6 sm:p-8">
          <p className="mb-3 text-sm font-bold uppercase tracking-widest text-pink">Admin</p>
          <h1 className="text-3xl leading-tight sm:text-4xl">
            Hello, <span className="font-bold break-words">{session.user.name}</span>
          </h1>
          <p className="mt-3 text-lg leading-relaxed text-white/60">
            Turn on edit mode, then head to the page you want to update.
          </p>

          <div className="my-7">
            <EditModeCheckbox />
          </div>

          <nav aria-label="Admin shortcuts" className="flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row">
            <Link href="/" className="flex flex-1 items-center justify-between rounded-lg border border-white/20 px-4 py-3 text-lg transition-colors hover:border-pink hover:text-pink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink">
              Upcoming Shows <span aria-hidden="true">&rarr;</span>
            </Link>
            <Link href="/archive" className="flex flex-1 items-center justify-between rounded-lg border border-white/20 px-4 py-3 text-lg transition-colors hover:border-pink hover:text-pink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink">
              Past Shows <span aria-hidden="true">&rarr;</span>
            </Link>
            <Link href="/artists" className="flex flex-1 items-center justify-between rounded-lg border border-white/20 px-4 py-3 text-lg transition-colors hover:border-pink hover:text-pink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink">
              Artists <span aria-hidden="true">&rarr;</span>
            </Link>
          </nav>
        </section>
      </div>
    );
  }

  return (
    <div className="flex min-h-[75svh] w-full items-center justify-center px-5 py-16 text-white">
      <section className="w-full max-w-lg rounded-2xl border border-white/15 bg-white/[0.03] p-6 sm:p-8">
        <p className="mb-3 text-sm font-bold uppercase tracking-widest text-pink">Admin</p>
        <h1 className="text-3xl font-bold sm:text-4xl">Sign in to edit</h1>
        <p className="mt-3 text-lg text-white/60">Manage your shows and artists.</p>
        <Link
          href="/admin/sign-in"
          className="mt-7 inline-flex items-center justify-center rounded-lg bg-pink px-5 py-3 text-lg font-bold text-black transition-colors hover:bg-pink/80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink"
        >
          Sign in
        </Link>
      </section>
    </div>
  );
}
