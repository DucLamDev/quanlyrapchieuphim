'use client'

import { useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'
import { useThemeStore } from '@/lib/theme'
import { motion } from 'framer-motion'

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore()

  useEffect(() => {
    const currentTheme = useThemeStore.getState().theme
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(currentTheme)
  }, [])

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="relative flex items-center gap-2 rounded-full border border-gray-300 bg-white px-3 py-2 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <>
          <Sun className="w-4 h-4 text-yellow-500" />
          <span className="hidden text-sm sm:inline">Sáng</span>
        </>
      ) : (
        <>
          <Moon className="w-4 h-4 text-blue-400" />
          <span className="hidden text-sm sm:inline">Tối</span>
        </>
      )}
    </motion.button>
  )
}
