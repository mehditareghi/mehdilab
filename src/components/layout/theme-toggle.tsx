import { Moon } from '@/components/animate-ui/icons/moon'
import { Sun } from '@/components/animate-ui/icons/sun'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/hooks/use-theme'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      onClick={toggleTheme}
    >
      {isDark ? (
        <Sun size={16} animateOnHover="default" />
      ) : (
        <Moon size={16} animateOnHover="default" />
      )}
    </Button>
  )
}
