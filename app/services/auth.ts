import {
  GoogleAuthProvider,
  getAuth,
  onAuthStateChanged,
  signInWithCredential,
  type User,
} from 'firebase/auth'
import { createContext, useContext, useEffect, useState } from 'react'
import { redirect } from 'react-router'
import { $path } from 'remix-routes'
import { getAccountByUID } from '~/models/account'
import { app } from './firebase'

// 特定のプロパティを必須にするユーティリティ型
type Required<T, K extends keyof T> = T & {
  [P in K]-?: T[P]
}

export interface AppUser extends User {
  handle?: string
}
let userHandle: string | undefined = undefined

export const AuthContext = createContext<AppUser | null>(null)
AuthContext.displayName = 'AuthContext'
export const AuthContextProvider = AuthContext.Provider

/**
 * root コンポーネントでの認証モニタリング
 */
export const useAuthStateObserve = () => {
  // Context 設定用の user state
  const [authState, setAuthState] = useState<AppUser | null>(null)

  useEffect(() => {
    const auth = getAuth(app)
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const account = await getAccountByUID(user.uid)
        setAuthState({ ...user, handle: account?.id })
      } else {
        userHandle = undefined
        setAuthState(null)
      }
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
 * オンボード済みか確認し、まだならオンボーディング画面にリダイレクト。オンボード済みならユーザハンドルを返す
 * @param request
 * @param user
 * @returns
 */
const verifyOnboarded = async (request: Request, user: User) => {
  if (userHandle) return userHandle

  const account = await getAccountByUID(user.uid)
  if (account) {
    userHandle = account.id // account.id = handle
    return userHandle
  }

  // アカウントがまだなく、かつオンボーディング画面ではない場合はオンボーディング画面にリダイレクト
  if (!new URL(request.url).pathname.startsWith('/welcome')) {
    throw redirect($path('/welcome'))
  }

  return undefined
}

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

  // オンボーディング済みか確認
  const handle = await verifyOnboarded(request, auth.currentUser)

  // 登録済みの場合は成功時のリダイレクト先にリダイレクト
  if (opts && 'successRedirect' in opts) throw redirect(opts?.successRedirect)

  // リダイレクト設定がない場合はユーザ情報をそのまま返す
  if (handle) {
    return { ...auth.currentUser, handle }
  }
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
 * clientLoader / clientAction でのユーザ情報取得ユーティリティ
 * ハンドル登録済みのユーザ情報を取得する
 * @param request
 * @param opt
 * @returns
 */
export const requireUser = async (
  request: Request,
  opt: { failureRedirect: string },
): Promise<Required<AppUser, 'handle'>> => {
  const user = await isAuthenticated(request, opt)
  if (!user.handle) throw new Error('ユーザ情報がありません')
  return { ...user, handle: user.handle }
}

export const verifyUser = async (request: Request, idToken: string) => {
  const auth = getAuth(app)
  const credential = GoogleAuthProvider.credential(idToken)
  await signInWithCredential(auth, credential)
  if (!auth.currentUser) throw new Error('サインインに失敗しました')

  // オンボーディング済みか確認
  const handle = await verifyOnboarded(request, auth.currentUser)
  return { ...auth.currentUser, handle }
}

/**
 * サインアウト
 */
export const signOut = async () => {
  const auth = getAuth(app)
  await auth.signOut()
}
