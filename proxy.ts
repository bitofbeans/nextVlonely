import { auth } from '@/lib/auth/server';

export default auth.middleware({
  // Redirects unauthenticated users to sign-in page
  loginUrl: '/admin/sign-in',
});

export const config = {
  matcher: [
    // Protected routes requiring authentication
    '/admin/:path*',
  ],
};