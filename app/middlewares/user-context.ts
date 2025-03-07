import { unstable_createContext } from 'react-router'
import type { AppUser } from '~/services/auth'

export const userContext = unstable_createContext<AppUser | null>()
