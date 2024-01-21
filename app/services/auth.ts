import { redirect } from '@remix-run/react'
import {
  GoogleAuthProvider,
  type User,
  getAuth,
  onAuthStateChanged,
  signInWithCredential,
} from 'firebase/auth'
import { createContext, useContext, useEffect, useState } from 'react'
import { getAccountByUID } from '~/models/account'
import { app } from './firebase'

interface AppUser extends User {
  handle: string | null
}

export const AuthContext = createContext<User | null>(null)
AuthContext.displayName = 'AuthContext'

/**
 * root コンポーネントでの認証モニタリング
 */
export const useAuthStateObserve = () => {
  // Context 設定用の user state
  const [authState, setAuthState] = useState<User | null>(null)

  useEffect(() => {
    const auth = getAuth(app)
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setAuthState(user)
    })
    return () => unsubscribe()
  }, [])

  return {
    authState,
  }
}

const verifyOnboarded = async (user: User) => {
  if (userHandle) return userHandle
  const account = await getAccountByUID(user.uid)
  if (account) return account.id // handle
  return null
}

/**
 * コンポーネントでのユーザ情報利用
 */
export const useAuthUser = () => {
  return useContext(AuthContext)
}

const userHandle: string | null = null
/**
 * clientLoader / clientAction での認証確認
 * @returns
 */
export async function isAuthenticated(request: Request): Promise<AppUser | null>
export async function isAuthenticated(
  request: Request,
  opts: {
    successRedirect: string
  },
): Promise<AppUser | null>
export async function isAuthenticated(
  request: Request,
  opts: {
    failureRedirect: string
  },
): Promise<AppUser>
export async function isAuthenticated(
  request: Request,
  opts: {
    successRedirect: string
    failureRedirect: string
  },
): Promise<null>
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

  const handle = await verifyOnboarded(auth.currentUser)
  if (!handle && new URL(request.url).pathname.startsWith('/welcome')) {
    // アカウントがまだなく、かつオンボーディング画面ではない場合はオンボーディング画面にリダイレクト
    throw redirect('/welcome')
  }

  // 登録済みの場合は成功時のリダイレクト先にリダイレクト
  if (opts && 'successRedirect' in opts) throw redirect(opts?.successRedirect)

  // リダイレクト設定がない場合はユーザ情報をそのまま返す
  return { ...auth.currentUser, handle: userHandle }
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
  const handle = await verifyOnboarded(auth.currentUser)
  return { ...auth.currentUser, handle }
}

/**
 * サインアウト
 */
export const signOut = async () => {
  const auth = getAuth(app)
  await auth.signOut()
}
