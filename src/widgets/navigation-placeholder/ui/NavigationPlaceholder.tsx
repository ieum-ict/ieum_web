import { BottomNavigation, type NavigationTab } from '../../bottom-navigation/ui/BottomNavigation'
import type { NavigationView } from '../../../entities/transport/model/types'

type NavigationPlaceholderProps = {
  activeTab: NavigationView
  onTabChange: (tab: NavigationTab) => void
}

const titles: Record<NavigationView, string> = {
  request: '요청 페이지',
  hospital: '병원 페이지',
  setting: '설정 페이지',
}

export function NavigationPlaceholder({ activeTab, onTabChange }: NavigationPlaceholderProps) {
  return (
    <main className="empty-transport-page">
      <section className="navigation-placeholder" aria-label={titles[activeTab]}>
        <h1>{titles[activeTab]}</h1>
      </section>
      <BottomNavigation activeTab={activeTab} onTabChange={onTabChange} />
    </main>
  )
}
