import { redirect } from 'react-router'

const STORAGE_KEY = 'google_oauth_validation'

// 検証用の値をローカルストレージに保存する
const storeValidationValue = (data: { state: string; nonce: string }) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

// 検証用の値をローカルストレージから取得し、削除する
const restoreValidationValue = () => {
  const data = localStorage.getItem(STORAGE_KEY)
  if (!data) {
    throw new Error(
      '認証セッションが見つかりません。再度ログインしてください。',
    )
  }
  localStorage.removeItem(STORAGE_KEY)
  return JSON.parse(data) as { state: string; nonce: string }
}

// JWT ペイロードをデコードする (署名検証は行わない)
const decodeJwtPayload = (token: string): Record<string, unknown> => {
  const base64Url = token.split('.')[1]
  if (!base64Url) {
    throw new Error('無効なトークン形式です')
  }
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  const jsonPayload = atob(base64)
  return JSON.parse(jsonPayload)
}

/**
 Google OpenID Connect Authenticator

 https://developers.google.com/identity/openid-connect/openid-connect?hl=ja
 */
export const createGoogleAuthenticator = <User>({
  clientID,
  callbackURL,
  hd,
  loginHint,
  verifyUser,
}: {
  clientID: string
  callbackURL: string
  prompt?: 'none' | 'consent' | 'select_acount'
  hd?: string
  loginHint?: string
  verifyUser: (request: Request, idToken: string) => Promise<User | null>
}) => {
  const authorizationURL = 'https://accounts.google.com/o/oauth2/v2/auth'
  const responseType = 'id_token'

  const buildCallbackURL = (request: Request) => {
    return new URL(callbackURL, request.url)
  }

  const buildAuthorizationURL = (
    request: Request,
    state: string,
    nonce: string,
  ) => {
    const params = new URLSearchParams({
      access_type: 'online',
      response_type: responseType,
      client_id: clientID,
      redirect_uri: buildCallbackURL(request).toString(),
      scope: [
        'openid',
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
      ].join(' '),
      state,
      nonce,
    })
    if (hd) params.set('hd', hd)
    if (loginHint) params.set('login_hint', loginHint)

    const url = new URL(authorizationURL)
    url.search = params.toString()

    return url.toString()
  }

  const authenticate = (request: Request) => {
    const url = new URL(request.url)
    const callbackURL = buildCallbackURL(request)

    // コールバックURL以外: 認可URLにリダイレクトし、コールバックさせる
    if (url.pathname !== callbackURL.pathname) {
      // コールバック時に state と nonce をチェックするために保存しておく
      // 暗号学的に安全な乱数を使用
      const validation = {
        state: crypto.randomUUID(),
        nonce: crypto.randomUUID(),
      }
      storeValidationValue(validation)

      // 認可 URL にリダイレクトさせる。成功するとコールバックURLにリダイレクトされる
      throw redirect(
        buildAuthorizationURL(request, validation.state, validation.nonce),
      )
    }
  }

  const authenticateCallback = async (request: Request) => {
    // コールバックURLの場合: パラメータをhashから取得
    const url = new URL(request.url)
    const params = new URLSearchParams(url.hash.slice(1))

    // Google からのエラーレスポンスをチェック
    const error = params.get('error')
    if (error) {
      const errorDescription = params.get('error_description') || error
      throw new Error(`認証エラー: ${errorDescription}`)
    }

    // 保存した検証値を取得
    const validation = restoreValidationValue()

    // state のチェック (CSRF 対策)
    if (validation.state !== params.get('state')) {
      throw new Error('不正なリクエストです。再度ログインしてください。')
    }

    // id トークンを取得
    const idToken = params.get('id_token')
    if (!idToken) {
      throw new Error('認証情報が取得できませんでした')
    }

    // 1. まず Firebase で署名検証を含む認証を実行
    const user = await verifyUser(request, idToken)

    // 2. 署名検証済みトークンから nonce を取得してチェック (リプレイ攻撃対策)
    const payload = decodeJwtPayload(idToken)
    if (payload.nonce !== validation.nonce) {
      throw new Error('不正なリクエストです。再度ログインしてください。')
    }

    return user
  }

  return {
    authenticate,
    authenticateCallback,
  }
}
