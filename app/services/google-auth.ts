import { href } from 'react-router'
import { createGoogleAuthenticator } from '~/libs/google-auth'
import { verifyUser, type AppUser } from './auth'

const googleAuthenticator = createGoogleAuthenticator<AppUser>({
  clientID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  callbackURL: href('/auth/google/callback'),
  verifyUser,
})

const authenticate = googleAuthenticator.authenticate
const authenticateCallback = googleAuthenticator.authenticateCallback
export { authenticate, authenticateCallback }
