import type { ReactNode } from 'react'
import { PullReqPage } from '../pages/pull-request/ui/PullReqPage'
import { TransportPage } from '../pages/transport-page'

type AppRoute = {
  path: string
  element: ReactNode
}

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
]

export function getRouteElement(pathname: string) {
  return routes.find((route) => route.path === pathname)?.element ?? routes[0].element
}
