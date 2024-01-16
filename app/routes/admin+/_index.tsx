import {
  ClientActionFunctionArgs,
  Outlet,
  useNavigation,
} from '@remix-run/react'
import { isAuthenticated } from '~/services/auth'

export const clientLoader = async () => {
  await isAuthenticated({ failureRedirect: '/' })
  return null
}

export const clientAction = async ({ request }: ClientActionFunctionArgs) => {
  await isAuthenticated({ failureRedirect: '/' })
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
