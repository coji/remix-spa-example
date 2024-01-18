import { createGoogleAuthenticator } from '~/libs/google-auth'

const googleAuthenticator = createGoogleAuthenticator({
  clientID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  callbackURL: '/auth/google/callback',
})
const authenticate = googleAuthenticator.authenticate
export { authenticate }
