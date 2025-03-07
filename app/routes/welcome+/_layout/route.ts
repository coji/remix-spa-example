import { href, redirect, unstable_createContext } from 'react-router'
import { requireAuth, type AppUser } from '~/services/auth'
import type { Route } from './+types/route'

export const userContext = unstable_createContext<AppUser | null>()

export const authMiddleware: Route.unstable_ClientMiddlewareFunction = async (
  { request, context },
  next,
) => {
  try {
    const user = await requireAuth(request, { failureRedirect: href('/') })
    // すでにユーザ登録済みの場合はプロフィールページにリダイレクト
    if (user.handle) {
      throw redirect(href('/:handle', { handle: user.handle }))
    }

    context.set(userContext, user)
    return next()
  } catch (error) {
    throw redirect(href('/'))
  }
}
export const unstable_clientMiddleware = [authMiddleware]
