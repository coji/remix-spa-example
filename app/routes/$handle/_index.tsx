import {
  ClientLoaderFunctionArgs,
  Outlet,
  useLoaderData,
} from '@remix-run/react'
import { isAuthenticated } from '~/services/auth'

export const clientLoader = async ({ request }: ClientLoaderFunctionArgs) => {
  return await isAuthenticated(request, { failureRedirect: '/' })
}

export default function Index() {
  const user = useLoaderData<typeof clientLoader>()
  return (
    <div>
      <h1 className="text-2xl">@{user.handle}</h1>

      <div>
        <Outlet />
      </div>
    </div>
  )
}
