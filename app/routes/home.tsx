import type { ClientLoaderFunctionArgs } from '@remix-run/react'
import { $path } from 'remix-routes'
import { requireUser } from '~/services/auth'
import IndexPage from './_index'

export const clientLoader = ({ request }: ClientLoaderFunctionArgs) => {
  const user = requireUser(request, { failureRedirect: $path('/') })
  return user
}

export default IndexPage
