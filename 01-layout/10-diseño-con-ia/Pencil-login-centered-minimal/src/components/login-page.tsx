import { Navigation2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1a6.6 6.6 0 0 1 0-4.22V7.04H2.18a11 11 0 0 0 0 9.9l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.04l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z"
      />
    </svg>
  )
}

export function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-background p-12">
      {/* Logo lockup */}
      <div className="flex items-center gap-2.5">
        <div className="flex size-10 items-center justify-center rounded-[10px] bg-primary">
          <Navigation2 className="size-[22px] text-primary-foreground" />
        </div>
        <span className="text-xl font-semibold text-foreground">Northwind</span>
      </div>

      {/* Header */}
      <div className="flex w-[480px] max-w-full flex-col items-center gap-2 text-center">
        <h1 className="text-[28px] font-semibold leading-tight text-foreground">
          Sign in to your account
        </h1>
        <p className="text-sm text-muted-foreground">
          Welcome back. Please enter your details.
        </p>
      </div>

      {/* Card */}
      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex w-[420px] max-w-full flex-col gap-5 rounded-2xl border border-border bg-card p-9 shadow-[0_4px_16px_rgba(10,10,10,0.05)]"
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="name@northwind.com"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox id="remember" defaultChecked />
            <Label htmlFor="remember" className="font-normal text-foreground">
              Remember me
            </Label>
          </div>
          <a
            href="#"
            className="text-sm font-medium text-primary hover:underline"
          >
            Forgot password?
          </a>
        </div>

        <Button type="submit" className="w-full">
          Sign in
        </Button>

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs font-medium text-muted-foreground">OR</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <Button type="button" variant="outline" className="w-full">
          <GoogleIcon className="size-4" />
          Continue with Google
        </Button>
      </form>

      {/* Footer */}
      <div className="flex items-center gap-1 text-sm">
        <span className="text-muted-foreground">Don't have an account?</span>
        <a href="#" className="font-medium text-primary hover:underline">
          Sign up
        </a>
      </div>
    </div>
  )
}
