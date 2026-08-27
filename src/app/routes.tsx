import type { ReactNode } from 'react'
import { HospitalPage } from '../pages/hospital-page/ui/HospitalPage'
import { LoginPage } from '../pages/login-page/ui/LoginPage'
import { HospitalComparePage } from '../pages/pull-request/ui/HospitalComparePage'
import { HospitalResponsePage } from '../pages/pull-request/ui/HospitalResponsePage'
import { PullReqDetailPage } from '../pages/pull-request/ui/PullReqDetailPage'
import { PullReqPage } from '../pages/pull-request/ui/PullReqPage'
import { ResourceDetailPage } from '../pages/pull-request/ui/ResourceDetailPage'
import { SettingsRoutePage } from '../pages/settings-page/ui/SettingsRoutePage'
import { SignupPage } from '../pages/signup-page/ui/SignupPage'
import { TransportPage } from '../pages/transport-page'
import type { NavigationTab } from '../widgets/bottom-navigation/ui/BottomNavigation'

type AppRoute = {
  path: string
  element: ReactNode
  showBottomNavigation?: boolean
}

const navigationPathByTab = {
  request: '/pull-request',
  hospital: '/hospital',
  transfer: '/transport',
  setting: '/setting',
} satisfies Record<NavigationTab, string>

const routePreviewRequest = {
  title: '위험 임산부',
  status: '진행중',
  description: '28주 1일 · 출혈, 진통',
  location: '경기 성남시 분당구',
  requestedAt: '2026. 08. 26. 14:34',
} as const

function navigateTo(path: string) {
  if (window.location.pathname === path) {
    return
  }

  window.history.pushState(null, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

export const routes: AppRoute[] = [
  {
    path: '/',
    element: <LoginPage />,
    showBottomNavigation: false,
  },
  {
    path: '/login',
    element: <LoginPage />,
    showBottomNavigation: false,
  },
  {
    path: '/signup',
    element: <SignupPage />,
    showBottomNavigation: false,
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
    path: '/pull-request/detail',
    element: (
      <PullReqDetailPage
        title={routePreviewRequest.title}
        status={routePreviewRequest.status}
        description={routePreviewRequest.description}
        location={routePreviewRequest.location}
        requestedAt={routePreviewRequest.requestedAt}
      />
    ),
  },
  {
    path: '/hospital',
    element: <HospitalPage />,
  },
  {
    path: '/hospital/resource-detail',
    element: (
      <ResourceDetailPage
        title={routePreviewRequest.title}
        status={routePreviewRequest.status}
        description={routePreviewRequest.description}
        currentLocation={routePreviewRequest.location}
        onBack={() => navigateTo('/pull-request/detail')}
      />
    ),
  },
  {
    path: '/hospital/response',
    element: <HospitalResponsePage onBack={() => navigateTo('/hospital/resource-detail')} />,
  },
  {
    path: '/hospital/compare',
    element: <HospitalComparePage onBack={() => navigateTo('/hospital/response')} />,
  },
  {
    path: '/setting',
    element: <SettingsRoutePage />,
  },
]

export function getRouteElement(pathname: string) {
  return routes.find((route) => route.path === pathname)?.element ?? routes[0].element
}

export function shouldShowBottomNavigation(pathname: string) {
  return routes.find((route) => route.path === pathname)?.showBottomNavigation ?? true
}

export function getPathFromNavigationTab(tab: NavigationTab) {
  return navigationPathByTab[tab]
}

export function getNavigationTabFromPath(pathname: string): NavigationTab {
  if (pathname === navigationPathByTab.hospital || pathname.startsWith(`${navigationPathByTab.hospital}/`)) {
    return 'hospital'
  }

  if (pathname === navigationPathByTab.transfer || pathname.startsWith(`${navigationPathByTab.transfer}/`)) {
    return 'transfer'
  }

  if (pathname === navigationPathByTab.setting || pathname.startsWith(`${navigationPathByTab.setting}/`)) {
    return 'setting'
  }

  return 'request'
}
