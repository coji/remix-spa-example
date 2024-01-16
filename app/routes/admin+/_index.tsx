import {
  ClientActionFunctionArgs,
  ClientLoaderFunctionArgs,
  Outlet,
} from '@remix-run/react'
import { isAuthenticated } from '~/services/auth'

export const clientLoader = async ({ request }: ClientLoaderFunctionArgs) => {
  await isAuthenticated(request, { failureRedirect: '/' })
  return null
}

export const clientAction = async ({ request }: ClientActionFunctionArgs) => {
  await isAuthenticated(request, { failureRedirect: '/' })
  return null
}

export default function Index() {
  return (
    <div>
      <h1 className="text-2xl">Tweeter!</h1>

      <div>
        <Outlet />
      </div>
    </div>
  )
}
