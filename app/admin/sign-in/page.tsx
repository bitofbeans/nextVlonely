'use client';

import { useActionState } from 'react';
import { signIn } from './actions';

export default function SignInForm() {
  const [state, formAction, isPending] = useActionState(signIn, null);

  return (
    <form action={formAction}
      className="flex flex-col gap-5 min-h-screen items-center justify-center ">

      <div className="w-sm">
       <h1 className="mt-10 text-center text-5xl font-bold text-white">login</h1>
      </div>

      <div className='flex flex-col gap-1.5 w-sm'>
        <label htmlFor="email" className="block text-2xl font-medium text-gray-100">email</label>
        <input id="email" name="email" type="email" required placeholder="type here"
          className="block rounded-md w-full bg-white/5 px-2 py-1.5 placeholder:text-gray-500 text-white outline-1 outline-white/10  focus:outline-indigo-500"/>
      </div>

      <div className='flex flex-col gap-1.5 w-sm'>
        <label htmlFor="password" className="block text-2xl font-medium text-gray-100">password</label>
        <input id="password" name="password" type="password" required placeholder="•••••"
          className="block rounded-md w-full bg-white/5 px-2 py-1.5 placeholder:text-gray-500 text-white outline-1 outline-white/10  focus:outline-indigo-500"/>
      </div>

      {state?.error && (
        <div className="rounded-md px-3 py-2 text-sm text-red-500">
          {state.error}
        </div>
      )}

      <button type="submit" disabled={isPending}
        className="bg-pink flex w-sm justify-center rounded-md px-3 py-1.5 text-xl font-harmond font-bold text-black hover:bg-indigo-400">
        sign in
      </button>
    </form>
  );
}