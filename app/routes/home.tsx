import type { ClientLoaderFunctionArgs } from 'react-router'
import { $path } from 'safe-routes'
import { requireUser } from '~/services/auth'
import IndexPage from './_index'

export const clientLoader = ({ request }: ClientLoaderFunctionArgs) => {
  const user = requireUser(request, { failureRedirect: $path('/') })
  return user
}

export default IndexPage
