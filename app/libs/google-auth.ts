import { redirect } from '@remix-run/react'

export const createGoogleAuthenticator = ({
  clientID,
  callbackURL,
  accessType = 'online',
  includeGrantedScopes = true,
  prompt,
  hd,
  loginHint,
  scope = [
    'openid',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
  ],
}: {
  clientID: string
  callbackURL: string
  accessType?: 'online' | 'offline'
  includeGrantedScopes?: boolean
  prompt?: 'none' | 'consent' | 'select_acount'
  hd?: string
  loginHint?: string
  scope?: string[]
}) => {
  const authorizationURL = 'https://accounts.google.com/o/oauth2/v2/auth'
  const responseType = 'id_token token'

  const buildCallbackURL = (request: Request) => {
    return new URL(callbackURL, request.url)
  }

  const buildAuthorizationURL = (request: Request, state: string) => {
    const params = new URLSearchParams({
      access_type: accessType,
      include_granted_scopes: String(includeGrantedScopes),
      response_type: responseType,
      client_id: clientID,
      redirect_uri: buildCallbackURL(request).toString(),
      scope: scope.join(' '),
      nonce: String(Math.random()),
      state,
    })
    if (prompt) params.set('prompt', prompt)
    if (hd) params.set('hd', hd)
    if (loginHint) params.set('login_hint', loginHint)

    const url = new URL(authorizationURL)
    url.search = params.toString()

    return url.toString()
  }

  const authenticate = async (request: Request) => {
    const url = new URL(request.url)

    // コールバックURL以外: 認可URLにリダイレクトし、コールバックさせる
    const callbackURL = buildCallbackURL(request)
    if (url.pathname !== callbackURL.pathname) {
      // localstorage に state を保存しておく
      const state = String(Math.random())
      await localStorage.setItem('state', state)
      throw redirect(buildAuthorizationURL(request, state))
    }

    // コールバックURLの場合: パラメータをhashから取得
    const params = new URLSearchParams(url.hash.slice(1))

    // state のチェック
    const state = await localStorage.getItem('state')
    if (!state) {
      throw new Error('state がありません')
    }
    await localStorage.removeItem('state')
    if (state !== params.get('state')) {
      throw new Error('state が一致しません')
    }

    // id トークンを取得
    const idToken = params.get('id_token')
    if (!idToken) {
      throw new Error('IDトークンがありません')
    }
    return idToken
  }

  return {
    authenticate,
  }
}
