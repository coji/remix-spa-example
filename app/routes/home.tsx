import { ClientLoaderFunctionArgs } from '@remix-run/react'
import { requireUser } from '~/services/auth'
import IndexPage from './_index'

export const clientLoader = ({ request }: ClientLoaderFunctionArgs) => {
  const user = requireUser(request, { failureRedirect: '/' })
  return user
}

export default IndexPage
