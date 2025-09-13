import { createContext } from 'react-router'
import type { AppUser } from '~/services/auth'

export const authContext = createContext<AppUser | null>()
