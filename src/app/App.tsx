import { useEffect, useState } from 'react'
import { createThemeVars } from '../shared/lib/theme'
import { BottomNavigation } from '../widgets/bottom-navigation/ui/BottomNavigation'
import type { NavigationTab } from '../widgets/bottom-navigation/ui/BottomNavigation'
import '../App.css'
import { getNavigationTabFromPath, getPathFromNavigationTab, getRouteElement } from './routes'

export default function App() {
  const [pathname, setPathname] = useState(() => window.location.pathname)

  useEffect(() => {
    const handleLocationChange = () => setPathname(window.location.pathname)

    window.addEventListener('popstate', handleLocationChange)
    return () => window.removeEventListener('popstate', handleLocationChange)
  }, [])

  const handleTabChange = (tab: NavigationTab) => {
    const nextPath = getPathFromNavigationTab(tab)

    if (nextPath === window.location.pathname) {
      return
    }

    window.history.pushState(null, '', nextPath)
    setPathname(nextPath)
  }

  return (
    <div style={createThemeVars()}>
      <main className="app-shell">
        <div className="app-shell__content">{getRouteElement(pathname)}</div>
        <BottomNavigation activeTab={getNavigationTabFromPath(pathname)} onTabChange={handleTabChange} />
      </main>
    </div>
  )
}
