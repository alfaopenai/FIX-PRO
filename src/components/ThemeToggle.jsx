import React from 'react'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

export default function ThemeToggle({ className = '', variant = 'pill' }) {
  const { theme, setTheme } = useTheme()

  if (variant === 'icons') {
    return (
      <div
        dir="rtl"
        className={`relative inline-flex items-center rounded-full p-1 overflow-hidden transition-all duration-300
          shadow-md hover:shadow-lg border w-[84px] h-8 select-none
          bg-white border-gray-300 hover:border-gray-400 hover:ring-1 hover:ring-cyan-200 text-gray-700
          dark:bg-gray-900/70 dark:border-gray-700 dark:text-gray-200 ${className}`}
        role="group"
        aria-label="Theme toggle"
      >
        <span
          className={`absolute inset-y-1 w-1/2 rounded-full transition-[left,right] duration-300
            bg-cyan-50 shadow border border-cyan-200
            dark:bg-gray-800 dark:border-gray-700
            ${theme === 'light' ? 'right-1 left-auto' : 'left-1 right-auto'}`}
          aria-hidden
        />
        <button
          type="button"
          onClick={() => setTheme('dark')}
          className={`relative z-10 inline-flex items-center justify-center w-9 h-6 rounded-full transition-colors
            ${theme === 'dark' ? 'text-white' : 'text-gray-500'}`}
          aria-pressed={theme === 'dark'}
        >
          <Moon className={`h-4 w-4 ${theme === 'dark' ? 'text-blue-500' : ''}`} />
        </button>
        <button
          type="button"
          onClick={() => setTheme('light')}
          className={`relative z-10 inline-flex items-center justify-center w-9 h-6 rounded-full transition-colors
            ${theme === 'light' ? 'text-gray-900' : 'text-gray-500'}`}
          aria-pressed={theme === 'light'}
        >
          <Sun className={`h-4 w-4 ${theme === 'light' ? 'text-amber-500' : ''}`} />
        </button>
      </div>
    )
  }

  return (
    <div
      dir="rtl"
      className={`relative inline-flex items-center rounded-full p-1 overflow-hidden transition-all duration-300
        shadow-md hover:shadow-lg border w-[156px] h-8 select-none
        bg-white border-gray-300 hover:border-gray-400 hover:ring-1 hover:ring-cyan-200 text-gray-700
        dark:bg-gray-900/70 dark:border-gray-700 dark:text-gray-200 ${className}`}
      role="group"
      aria-label="Theme toggle"
    >
      {/* Active background slider (moves between halves) */}
      <span
        className={`absolute inset-y-1 w-1/2 rounded-full transition-[left,right] duration-300
          bg-cyan-50 shadow border border-cyan-200
          dark:bg-gray-800 dark:border-gray-700
          ${theme === 'light' ? 'right-1 left-auto' : 'left-1 right-auto'}`}
        aria-hidden
      />

      {/* Left segment: Dark mode */}
      <button
        type="button"
        onClick={() => setTheme('dark')}
        className={`relative z-10 inline-flex items-center justify-center gap-1.5 w-[72px] h-6 rounded-full transition-colors
          ${theme === 'dark' ? 'text-white' : 'text-gray-500'}`}
        aria-pressed={theme === 'dark'}
      >
        <Moon className={`h-3.5 w-3.5 ${theme === 'dark' ? 'text-blue-500' : ''}`} />
        <span className="text-xs font-medium">מצב כהה</span>
      </button>

      {/* Right segment: Light mode */}
      <button
        type="button"
        onClick={() => setTheme('light')}
        className={`relative z-10 inline-flex items-center justify-center gap-1.5 w-[72px] h-6 rounded-full transition-colors
          ${theme === 'light' ? 'text-gray-900' : 'text-gray-500'}`}
        aria-pressed={theme === 'light'}
      >
        <Sun className={`h-3.5 w-3.5 ${theme === 'light' ? 'text-amber-500' : ''}`} />
        <span className="text-xs font-medium">מצב בהיר</span>
      </button>
    </div>
  )
}


