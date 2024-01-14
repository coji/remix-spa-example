import { Form, useNavigation } from '@remix-run/react'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '~/components/ui'
import { signIn } from '~/services/auth'
import { authenticate } from '~/services/auth'

export const clientLoader = async () => {
  const user = await authenticate({ successRedirect: '/' })
  console.log({ user })
  return null
}

export const clientAction = async () => {
  await signIn()
  return null
}
export default function IndexPage() {
  const navigation = useNavigation()
  return (
    <div className="grid grid-cols-1 h-screen place-items-center">
      <Card className="w-full max-w-xs">
        <CardContent>
          <CardHeader>
            <CardTitle className="text-center">サインイン</CardTitle>
          </CardHeader>

          <Form method="POST" action="/sign_in">
            <Button className="w-full" disabled={navigation.state !== 'idle'}>
              {navigation.state === 'submitting'
                ? 'サインインしています...'
                : 'Google アカウントで続ける'}
            </Button>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
