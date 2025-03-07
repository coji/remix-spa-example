import {
  href,
  redirect,
  type unstable_MiddlewareFunction as MiddlewareFunction,
} from 'react-router'
import { requireAuth } from '~/services/auth'
import { userContext } from './user-context'

export const onBoardingAuthMiddleware: MiddlewareFunction = async ({
  request,
  context,
}) => {
  // オンボーディング手続きはログインしていないとアクセスできない
  const user = await requireAuth(request, { failureRedirect: href('/') })
  context.set(userContext, user)

  // すでにオンボーディング済みの場合はプロフィールページにリダイレクト
  if (user.handle) {
    throw redirect(href('/:handle', { handle: user.handle }))
  }
}
