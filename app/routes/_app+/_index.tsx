import {
  ClientActionFunctionArgs,
  Form,
  Link,
  Outlet,
  useActionData,
  useLoaderData,
  useNavigation,
} from '@remix-run/react'
import { authenticate } from '~/services/auth'

export const clientLoader = async () => {
  console.log('hoge')
  await authenticate({ failureRedirect: '/sign_in' })
  return null
}

export const clientAction = async ({ request }: ClientActionFunctionArgs) => {
  const user = await authenticate({ failureRedirect: '/sign_in' })
  return null
}

export default function Index() {
  const navigation = useNavigation()

  return (
    <div>
      <h1 className="text-2xl">Tweeter!</h1>

      <div>
        <Outlet />
      </div>
    </div>
  )
}
