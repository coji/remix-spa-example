import { clsx, type ClassValue } from 'clsx'
import { createTwc } from 'react-twc'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const twx = createTwc({ compose: cn })
