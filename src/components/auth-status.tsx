'use client'

import { Button } from '@/components/ui/button'

// Mock auth status component (no real session in stub mode)
export function AuthStatus() {
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
