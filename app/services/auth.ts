import { redirect } from '@remix-run/react'
import {
  GoogleAuthProvider,
  type User,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
} from 'firebase/auth'
import { createContext, useContext, useEffect, useState } from 'react'
import { app } from './firebase'

export const AuthContext = createContext<User | null | undefined>(null)

/**
 * root コンポーネントでの認証モニタリング
 */
export const useAuthStateObserve = () => {
  // Context 設定用の user state
  const [authState, setAuthState] = useState<User | null | undefined>(undefined)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(app), (user) => {
      setAuthState(user)
    })
    return () => unsubscribe()
  }, [])

  return {
    authState,
  }
}

/**
 * コンポーネントでの認証利用用
 */
export const useAuthUser = () => {
  return useContext(AuthContext)
}

/**
 * clientLoader / clientAction での認証確認
 * @returns
 */
interface AuthentiateProps {
  successRedirect?: string
  failureRedirect?: string
}
export const authenticate = async (props?: AuthentiateProps) => {
  const auth = getAuth(app)
  await auth.authStateReady()
  if (auth.currentUser) {
    if (props?.successRedirect) throw redirect(props?.successRedirect)
    return auth.currentUser
  }

  if (props?.failureRedirect) throw redirect(props?.failureRedirect)
  return null
}

/**
 * サインイン
 * @returns
 */
export const signIn = async () => {
  const provider = new GoogleAuthProvider()
  provider.addScope('profile')
  provider.addScope('email')
  const auth = getAuth(app)
  return await signInWithPopup(auth, provider)
}

/**
 * サインアウト
 */
export const signOut = async () => {
  const auth = getAuth(app)
  await auth.signOut()
}
