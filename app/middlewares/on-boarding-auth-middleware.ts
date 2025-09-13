import { href, type MiddlewareFunction, redirect } from 'react-router'
import { requireAuth } from '~/services/auth'
import { authContext } from './auth-context'

export const onBoardingAuthMiddleware: MiddlewareFunction = async ({
  request,
  context,
}) => {
  // オンボーディング手続きはログインしていないとアクセスできない
  const user = await requireAuth(request, { failureRedirect: href('/') })
  context.set(authContext, user)

  // すでにオンボーディング済みの場合はプロフィールページにリダイレクト
  if (user.handle) {
    throw redirect(href('/:handle', { handle: user.handle }))
  }
}
