import { href, Link, redirect, useFetcher } from 'react-router'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui'
import { isAuthenticated } from '~/services/auth'
import { authenticate } from '~/services/google-auth'
import type { Route } from './+types/route'

export const clientLoader = async ({ request }: Route.ClientLoaderArgs) => {
  const user = await isAuthenticated(request)
  if (user?.handle) {
    return redirect(href('/:handle', { handle: user.handle }))
  }
  return null
}

export const clientAction = async ({ request }: Route.ClientActionArgs) => {
  return await authenticate(request)
}

const SignInForm = () => {
  const fetcher = useFetcher<typeof clientAction>()

  return (
    <div className="mx-auto text-center">
      <fetcher.Form method="POST" action={href('/auth/sign_in')}>
        <Button
          type="submit"
          className="rounded-full"
          isLoading={fetcher.state !== 'idle'}
        >
          Google アカウントでサインイン
        </Button>
      </fetcher.Form>
    </div>
  )
}

export const SignInModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="rounded-full" variant="outline">
          はじめる
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>しずかな Remix SPA Example</DialogTitle>
          <DialogDescription>
            しずかな Remix SPA Example にサインインしてください。
          </DialogDescription>
        </DialogHeader>

        <SignInForm />
      </DialogContent>
    </Dialog>
  )
}

export default function SignInPage() {
  return (
    <div className="grid h-screen grid-rows-1">
      <Card className="m-auto w-full max-w-md">
        <CardHeader>
          <CardTitle>しずかな Remix SPA Example</CardTitle>
          <CardDescription>
            しずかな Remix SPA Example にサインインしてください。
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex">
              <SignInForm />
            </div>

            <div className="mx-auto text-center">
              <Button type="button" variant="link" asChild>
                <Link to={href('/')}>トップページに戻る</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
