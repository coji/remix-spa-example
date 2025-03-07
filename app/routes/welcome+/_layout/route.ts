import { onBoardingAuthMiddleware } from '~/middlewares/on-boarding-auth-middleware'

// Middleware を設定
export const unstable_clientMiddleware = [onBoardingAuthMiddleware]
