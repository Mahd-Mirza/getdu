import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Formats an AED amount to two decimal places without floating-point artifacts. */
export function formatAedAmount(amount: number): string {
  return (Math.round(amount * 100) / 100).toFixed(2)
}
