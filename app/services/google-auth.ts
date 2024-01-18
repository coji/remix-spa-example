import { createGoogleAuthenticator } from '~/libs/google-auth'

const googleAuthenticator = createGoogleAuthenticator({
  clientID:
    '555137498198-910lfdq60rjkclt8hbut5bhe0esfv4vn.apps.googleusercontent.com',
  clientSecret: import.meta.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback',
})
const authenticate = googleAuthenticator.authenticate
export { authenticate }
