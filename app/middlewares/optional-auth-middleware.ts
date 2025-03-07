import type { unstable_MiddlewareFunction as MiddlewareFunction } from 'react-router'
import { isAuthenticated } from '~/services/auth'
import { userContext } from './user-context'

export const optionalAuthMiddleware: MiddlewareFunction = async ({
  request,
  context,
}) => {
  // ログインしている場合はユーザー情報をセット
  const user = await isAuthenticated(request)
  context.set(userContext, user)
}
