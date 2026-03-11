import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'light' | 'dark'

const applyTheme = (theme: Theme) => {
  if (typeof window === 'undefined') return

  document.documentElement.classList.remove('light', 'dark')
  document.documentElement.classList.add(theme)
}

interface ThemeState {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'dark',
      toggleTheme: () => set((state) => {
        const newTheme = state.theme === 'dark' ? 'light' : 'dark'
        applyTheme(newTheme)
        return { theme: newTheme }
      }),
      setTheme: (theme) => set(() => {
        applyTheme(theme)
        return { theme }
      })
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyTheme(state.theme)
        }
      }
    }
  )
)
