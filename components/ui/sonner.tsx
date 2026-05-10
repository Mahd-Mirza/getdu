'use client'

import { useTheme } from 'next-themes'
import { Toaster as Sonner, ToasterProps } from 'sonner'

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
          '--border-radius': '14px',
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: 'gap-3 px-4 py-3.5 sm:min-w-[320px]',
          title: 'text-[13px] sm:text-sm',
          closeButton: 'opacity-90 hover:opacity-100 transition-opacity',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
