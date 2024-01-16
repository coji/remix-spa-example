import { redirect } from '@remix-run/react'
import {
  GoogleAuthProvider,
  type User,
  getAuth,
  onAuthStateChanged,
  signInWithCredential,
} from 'firebase/auth'
import { createContext, useContext, useEffect, useState } from 'react'
import { type Account, getAccountByUID } from '~/models/account'
import { app } from './firebase'

interface AuthContextProps {
  user: User | null
  handle: string | null
  isOnBoarded: boolean
}
let authContextProps: AuthContextProps = {
  user: null,
  handle: null,
  isOnBoarded: false,
}

export const AuthContext = createContext<AuthContextProps>(authContextProps)
/**
 * root コンポーネントでの認証モニタリング
 */
export const useAuthStateObserve = () => {
  // Context 設定用の user state
  const [authState, setAuthState] = useState<AuthContextProps>(authContextProps)

  useEffect(() => {
    const auth = getAuth(app)
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      let account: Account | undefined = undefined
      if (user) {
        account = await getAccountByUID(user.uid)
      }

      authContextProps = {
        user,
        handle: account?.id ?? null,
        isOnBoarded: !!account,
      }
      setAuthState(authContextProps)

      console.log('onAuthStateChanged', { authContextProps })
    })
    return () => unsubscribe()
  }, [])

  return {
    authState,
  }
}

/**
 * コンポーネントでのユーザ情報利用
 */
export const useAuthUser = () => {
  return useContext(AuthContext)
}

/**
 * clientLoader / clientAction での認証確認
 * @returns
 */
export async function isAuthenticated(request: Request): Promise<User | never>
export async function isAuthenticated(
  request: Request,
  opts: {
    successRedirect: string
  },
): Promise<User | never>
export async function isAuthenticated(
  request: Request,
  opts: {
    failureRedirect: string
  },
): Promise<User>
export async function isAuthenticated(
  request: Request,
  opts: {
    successRedirect: string
    failureRedirect: string
  },
): Promise<never>
export async function isAuthenticated(
  request: Request,
  opts?:
    | { successRedirect: string }
    | { failureRedirect: string }
    | {
        successRedirect: string
        failureRedirect: string
      },
) {
  // 認証初期化を待つ
  const auth = getAuth(app)
  await auth.authStateReady()

  // ログインしていない場合は失敗時のリダイレクト先にリダイレクト
  if (!auth.currentUser) {
    if (opts && 'failureRedirect' in opts) throw redirect(opts?.failureRedirect)
    return null
  }

  // オンボーディングが完了していない場合はオンボーディング画面にリダイレクト
  const url = new URL(request.url)
  if (
    authContextProps.isOnBoarded === false &&
    !url.pathname.startsWith('/welcome')
  ) {
    throw redirect('/welcome')
  }

  // 登録済みの場合は成功時のリダイレクト先にリダイレクト
  if (opts && 'successRedirect' in opts) throw redirect(opts?.successRedirect)

  // リダイレクト設定がない場合はユーザ情報をそのまま返す
  return auth.currentUser
}

/**
 * clientLoader / clientAction での認証状態確認ユーティリティ
 * @param request リクエスト
 * @param failureRedirect ログインしていない場合のリダイレクト先
 * @returns
 */
export const requireAuth = async (
  request: Request,
  opt: { failureRedirect: string },
) => {
  return await isAuthenticated(request, opt)
}

/**
 * サインイン
 * @returns
 */
export const signIn = async (idToken: string) => {
  const auth = getAuth(app)
  const credential = GoogleAuthProvider.credential(idToken)
  await signInWithCredential(auth, credential)
  if (!auth.currentUser) throw new Error('サインインに失敗しました')
  return auth.currentUser
}

/**
 * サインアウト
 */
export const signOut = async () => {
  const auth = getAuth(app)
  await auth.signOut()
}
