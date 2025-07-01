'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <Button variant="outline" size="sm" disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading...
      </Button>
    );
  }

  if (session) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          {session.user?.image && (
            <Image
              src={session.user.image}
              alt={session.user.name || 'User avatar'}
              width={32}
              height={32}
              className="rounded-full"
            />
          )}
          <span className="hidden md:inline text-sm font-medium">
            {session.user?.name}
          </span>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => signOut()}
        >
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={() => signIn('google')}
    >
      Sign In
    </Button>
  );
}