import { useEffect, useState } from 'react'
import { createThemeVars } from '../shared/lib/theme'
import { BottomNavigation } from '../widgets/bottom-navigation/ui/BottomNavigation'
import type { NavigationTab } from '../widgets/bottom-navigation/ui/BottomNavigation'
import '../App.css'
import { getNavigationTabFromPath, getPathFromNavigationTab, getRouteElement, shouldShowBottomNavigation } from './routes'

export default function App() {
  const [pathname, setPathname] = useState(() => window.location.pathname)

  useEffect(() => {
    const handleLocationChange = () => {
      if (window.location.hash) {
        window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`)
      }

      setPathname(window.location.pathname)
    }

    window.addEventListener('popstate', handleLocationChange)
    window.addEventListener('hashchange', handleLocationChange)
    handleLocationChange()

    return () => {
      window.removeEventListener('popstate', handleLocationChange)
      window.removeEventListener('hashchange', handleLocationChange)
    }
  }, [])

  const handleTabChange = (tab: NavigationTab) => {
    const nextPath = getPathFromNavigationTab(tab)

    if (nextPath === window.location.pathname) {
      return
    }

    window.history.pushState(null, '', nextPath)
    setPathname(nextPath)
  }

  const showBottomNavigation = shouldShowBottomNavigation(pathname)

  return (
    <div style={createThemeVars()}>
      <main className="app-shell">
        <div className="app-shell__content">{getRouteElement(pathname)}</div>
        {showBottomNavigation ? (
          <BottomNavigation activeTab={getNavigationTabFromPath(pathname)} onTabChange={handleTabChange} />
        ) : null}
      </main>
    </div>
  )
}
