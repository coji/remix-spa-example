import {
  ClientActionFunctionArgs,
  ClientLoaderFunctionArgs,
  Form,
  Link,
  useFetcher,
} from '@remix-run/react'
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
import { isAuthenticated, signIn } from '~/services/auth'
import { authenticate } from '~/services/google-auth'

export const clientLoader = async ({ request }: ClientLoaderFunctionArgs) => {
  await isAuthenticated(request, { successRedirect: '/admin' })
  return null
}

export const clientAction = async ({ request }: ClientActionFunctionArgs) => {
  const accessToken = await authenticate(request)
  return null
}

const SignInForm = () => {
  const fetcher = useFetcher()

  const handleClickSignIn = async () => {
    fetcher.submit(
      {},
      {
        method: 'POST',
        action: '/sign_in',
      },
    )
  }

  return (
    <div className="mx-auto text-center">
      <Button onClick={() => handleClickSignIn()}>
        Google アカウントでサインイン
      </Button>
    </div>
  )
}

export const SignInModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">はじめる</Button>
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
    <div className="grid grid-rows-1 h-screen">
      <Card className="w-full max-w-md m-auto">
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

            <div className="text-center mx-auto">
              <Button variant="link" asChild>
                <Link to="/">トップページに戻る</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
