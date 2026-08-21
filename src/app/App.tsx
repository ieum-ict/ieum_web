import { getRouteElement } from './routes'

export default function App() {
  return getRouteElement(window.location.pathname)
}
