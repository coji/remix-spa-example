import { redirect } from '@remix-run/react'

// 検証用の値をローカルストレージに保存する
const storeValidationValue = async (
  key: string,
  data: { state: string; nonce: string },
) => {
  await localStorage.setItem(key, JSON.stringify(data))
}

// 検証用の値をローカルストレージから取得し、削除する
const restoreValidationValue = async (key: string) => {
  const data = await localStorage.getItem(key)
  if (!data) {
    throw new Error('state がありません')
  }
  await localStorage.removeItem(key)
  return JSON.parse(data) as { state: string; nonce: string }
}

/**
 Google OpenID Connect Authenticator

 https://developers.google.com/identity/openid-connect/openid-connect?hl=ja
 */
export const createGoogleAuthenticator = ({
  clientID,
  callbackURL,
  hd,
  loginHint,
}: {
  clientID: string
  callbackURL: string
  prompt?: 'none' | 'consent' | 'select_acount'
  hd?: string
  loginHint?: string
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

  const authenticate = async (request: Request) => {
    const url = new URL(request.url)

    const callbackURL = buildCallbackURL(request)

    // コールバックURL以外: 認可URLにリダイレクトし、コールバックさせる
    if (url.pathname !== callbackURL.pathname) {
      // コールバック時に state と nonce をチェックするために保存しておく
      const validation = {
        state: String(Math.random()),
        nonce: String(Math.random()),
      }
      await storeValidationValue('v', validation)

      // 認可 URL にリダイレクトさせる。成功するとコールバックURLにリダイレクトされる
      throw redirect(
        buildAuthorizationURL(request, validation.state, validation.nonce),
      )
    }

    // コールバックURLの場合: パラメータをhashから取得
    const params = new URLSearchParams(url.hash.slice(1))

    // state のチェック
    const validation = await restoreValidationValue('v')
    if (validation.state !== params.get('state')) {
      throw new Error('state が一致しません')
    }

    // id トークンを取得
    const idToken = params.get('id_token')
    if (!idToken) {
      throw new Error('IDトークンがありません')
    }

    // id トークンのペイロードに含まれる nonce のチェック
    const jsonPayload = atob(
      idToken.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'),
    )
    if (JSON.parse(jsonPayload).nonce !== validation.nonce) {
      throw new Error('nonce が一致しません')
    }

    return idToken
  }

  return {
    authenticate,
  }
}
