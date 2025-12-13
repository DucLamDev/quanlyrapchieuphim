'use client'

import { Globe } from 'lucide-react'
import { useLanguageStore } from '@/lib/i18n'
import { motion } from 'framer-motion'

export function LanguageToggle() {
  const { language, setLanguage } = useLanguageStore()

  const toggleLanguage = () => {
    setLanguage(language === 'vi' ? 'en' : 'vi')
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleLanguage}
      className="relative w-10 h-10 rounded-full bg-gray-800 dark:bg-gray-700 flex items-center justify-center transition-colors hover:bg-gray-700 dark:hover:bg-gray-600"
      aria-label="Toggle language"
      title={language === 'vi' ? 'Switch to English' : 'Chuyển sang tiếng Việt'}
    >
      <Globe className="w-5 h-5 text-gray-300" />
      <span className="absolute -bottom-1 -right-1 text-[10px] font-bold bg-cinema-600 text-white px-1 rounded">
        {language.toUpperCase()}
      </span>
    </motion.button>
  )
}
