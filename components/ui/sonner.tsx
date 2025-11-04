'use client'

import { useEffect, useState } from 'react'
import { Toaster as Sonner, ToasterProps } from 'sonner'

const Toaster = ({ ...props }: ToasterProps) => {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light')

  useEffect(() => {
    const html = document.documentElement
    const isDark = html.classList.contains('dark')
    setTheme(isDark ? 'dark' : 'light')
    
    // Watch for theme changes
    const observer = new MutationObserver(() => {
      const isDark = html.classList.contains('dark')
      setTheme(isDark ? 'dark' : 'light')
    })
    
    observer.observe(html, {
      attributes: true,
      attributeFilter: ['class'],
    })
    
    return () => observer.disconnect()
  }, [])

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      {...props}
    />
  )
}

export { Toaster }
