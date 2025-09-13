import type { MiddlewareFunction } from 'react-router'
import { isAuthenticated } from '~/services/auth'
import { authContext } from './auth-context'

export const optionalAuthMiddleware: MiddlewareFunction = async ({
  request,
  context,
}) => {
  // ログインしている場合はユーザー情報をセット
  const user = await isAuthenticated(request)
  context.set(authContext, user)
}
