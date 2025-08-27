'use client'

import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'

export function AuthStatus() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <div className="text-sm text-gray-600">Loading...</div>
  }

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <div className="text-sm">
          <span className="text-gray-600">Welcome, </span>
          <span className="font-medium">{session.user?.name || session.user?.email}</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => signOut({ callbackUrl: '/' })}
        >
          Sign Out
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => window.location.href = '/auth/signin'}
      >
        Sign In
      </Button>
    </div>
  )
}
