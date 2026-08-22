import type { ReactNode } from 'react'
import { HospitalPage } from '../pages/hospital-page/ui/HospitalPage'
import { PullReqPage } from '../pages/pull-request/ui/PullReqPage'
import { SettingsRoutePage } from '../pages/settings-page/ui/SettingsRoutePage'
import { TransportPage } from '../pages/transport-page'
import type { NavigationTab } from '../widgets/bottom-navigation/ui/BottomNavigation'

type AppRoute = {
  path: string
  element: ReactNode
}

const navigationPathByTab = {
  request: '/pull-request',
  hospital: '/hospital',
  transfer: '/transport',
  setting: '/setting',
} satisfies Record<NavigationTab, string>

export const routes: AppRoute[] = [
  {
    path: '/',
    element: <>ddd</>,
  },
  {
    path: '/transport',
    element: <TransportPage />,
  },
  {
    path: '/pull-request',
    element: <PullReqPage />,
  },
  {
    path: '/hospital',
    element: <HospitalPage />,
  },
  {
    path: '/setting',
    element: <SettingsRoutePage />,
  },
]

export function getRouteElement(pathname: string) {
  return routes.find((route) => route.path === pathname)?.element ?? routes[0].element
}

export function getPathFromNavigationTab(tab: NavigationTab) {
  return navigationPathByTab[tab]
}

export function getNavigationTabFromPath(pathname: string): NavigationTab {
  if (pathname === navigationPathByTab.hospital) {
    return 'hospital'
  }

  if (pathname === navigationPathByTab.transfer) {
    return 'transfer'
  }

  if (pathname === navigationPathByTab.setting) {
    return 'setting'
  }

  return 'request'
}
