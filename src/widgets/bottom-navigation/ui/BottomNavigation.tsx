import {
  navCarFillIcon,
  navCarIcon,
  navHospitalFillIcon,
  navHospitalIcon,
  navReportFillIcon,
  navReportIcon,
  navSettingFillIcon,
  navSettingIcon,
} from '../../../shared/config/assets'

export type NavigationTab = 'request' | 'hospital' | 'transfer' | 'setting'

type BottomNavigationProps = {
  activeTab: NavigationTab
  onTabChange?: (tab: NavigationTab) => void
}

const navItems = [
  { key: 'request', label: '요청', defaultIcon: navReportIcon, activeIcon: navReportFillIcon },
  { key: 'hospital', label: '병원', defaultIcon: navHospitalIcon, activeIcon: navHospitalFillIcon },
  { key: 'transfer', label: '이송', defaultIcon: navCarIcon, activeIcon: navCarFillIcon },
  { key: 'setting', label: '설정', defaultIcon: navSettingIcon, activeIcon: navSettingFillIcon },
] as const

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  return (
    <nav className="bottom-navigation" aria-label="하단 네비게이션">
      <div className="bottom-navigation__items">
        {navItems.map((item) => {
          const isActive = item.key === activeTab

          return (
            <button
              key={item.key}
              className={`bottom-navigation__item ${isActive ? 'is-active' : ''}`}
              type="button"
              aria-current={isActive ? 'page' : undefined}
              aria-label={item.label}
              onClick={() => onTabChange?.(item.key)}
            >
              <span className="bottom-navigation__icon">
                <img src={isActive ? item.activeIcon : item.defaultIcon} alt="" draggable="false" />
              </span>
              <span>{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
