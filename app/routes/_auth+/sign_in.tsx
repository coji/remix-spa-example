import { Form, Link, useNavigation } from '@remix-run/react'
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
import { authenticate } from '~/services/auth'

export const clientLoader = async () => {
  const user = await authenticate({
    registerRedirect: '/welcome',
    successRedirect: '/admin',
  })
  return null
}

export const clientAction = async () => {
  await signIn()
  return null
}

const SignInForm = () => {
  const navigation = useNavigation()

  return (
    <Form method="POST" action="/sign_in">
      <Button className="w-full" disabled={navigation.state !== 'idle'}>
        {navigation.state === 'submitting'
          ? 'サインインしています...'
          : 'Google アカウントでサインイン'}
      </Button>
    </Form>
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
          <SignInForm />

          <div className="text-center">
            <Button variant="link" asChild>
              <Link to="/">トップページに戻る</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
