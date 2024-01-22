import { createGoogleAuthenticator } from '~/libs/google-auth'
import { type AppUser, verifyUser } from './auth'

const googleAuthenticator = createGoogleAuthenticator<AppUser>({
  clientID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  callbackURL: '/auth/google/callback',
  verifyUser,
})

const authenticate = googleAuthenticator.authenticate
const authenticateCallback = googleAuthenticator.authenticateCallback
export { authenticate, authenticateCallback }
