import { GoogleLogin } from '@react-oauth/google'
import { GoogleOAuthProvider } from '@react-oauth/google'
import {
  ClientActionFunctionArgs,
  Link,
  redirect,
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
import { signIn } from '~/services/auth'

export const clientAction = async ({ request }: ClientActionFunctionArgs) => {
  const formData = await request.formData()
  const credential = formData.get('credential')?.toString()
  if (!credential) {
    throw new Error('credential is not found')
  }

  // サインイン
  await signIn(credential)
  return redirect('/admin')
}

const SignInForm = () => {
  const fetcher = useFetcher()

  return (
    <div className="mx-auto text-center">
      <GoogleOAuthProvider clientId="555137498198-910lfdq60rjkclt8hbut5bhe0esfv4vn.apps.googleusercontent.com">
        <GoogleLogin
          theme="filled_black"
          onSuccess={async (cred) => {
            if (!cred.credential) {
              throw new Error('credential is not found')
            }
            fetcher.submit(
              { credential: cred.credential },
              { method: 'POST', action: '/sign_in' },
            )
          }}
          onError={() => console.log('error')}
        />
      </GoogleOAuthProvider>
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
