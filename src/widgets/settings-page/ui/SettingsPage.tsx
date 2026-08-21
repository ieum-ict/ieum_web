import {
  chevronIcon,
  settingsAlarmIcon,
  settingsHospitalInfoIcon,
  settingsProfileBodyIcon,
  settingsProfileEditIcon,
  settingsProfileHeadIcon,
} from '../../../shared/config/assets'
import { BottomNavigation, type NavigationTab } from '../../bottom-navigation/ui/BottomNavigation'

type SettingsPageProps = {
  onTabChange: (tab: NavigationTab) => void
  onOpenAlerts: () => void
  onOpenHospitalManagement: () => void
  onOpenProfileEdit: () => void
}

const settingItems = [
  { icon: settingsAlarmIcon, label: '알림 설정', action: 'alerts' },
  { icon: settingsHospitalInfoIcon, label: '병원 정보 관리', action: 'hospitals' },
  { icon: settingsProfileEditIcon, label: '회원 정보 수정', action: 'profile' },
] as const

export function SettingsPage({
  onTabChange,
  onOpenAlerts,
  onOpenHospitalManagement,
  onOpenProfileEdit,
}: SettingsPageProps) {
  const handleItemClick = (action: (typeof settingItems)[number]['action']) => {
    if (action === 'alerts') {
      onOpenAlerts()
      return
    }

    if (action === 'hospitals') {
      onOpenHospitalManagement()
      return
    }

    onOpenProfileEdit()
  }

  return (
    <main className="settings-page">
      <header className="transport-header">
        <h1>설정</h1>
      </header>

      <section className="settings-page__content" aria-label="설정 페이지">
        <div className="settings-page__profile">
          <div className="settings-page__avatar" aria-hidden="true">
            <img className="settings-page__avatar-body" src={settingsProfileBodyIcon} alt="" draggable="false" />
            <img className="settings-page__avatar-head" src={settingsProfileHeadIcon} alt="" draggable="false" />
          </div>

          <div className="settings-page__profile-copy">
            <h2>홍길동</h2>
            <p>
              <span>hongkd@gmail.com</span>
              <span aria-hidden="true">·</span>
              <span>산부인과 전문의</span>
            </p>
          </div>
        </div>

        <section className="settings-card" aria-label="설정 항목">
          <div className="settings-card__list">
            {settingItems.map((item) => (
              <button key={item.label} className="settings-card__item" type="button" onClick={() => handleItemClick(item.action)}>
                <span className="settings-card__item-info">
                  <span className="settings-card__icon">
                    <img src={item.icon} alt="" draggable="false" />
                  </span>
                  <span className="settings-card__label">{item.label}</span>
                </span>

                <span className="settings-card__chevron" aria-hidden="true">
                  <img src={chevronIcon} alt="" draggable="false" />
                </span>
              </button>
            ))}
          </div>

          <div className="settings-card__actions">
            <button className="settings-card__secondary" type="button">
              로그아웃
            </button>
            <button className="settings-card__danger" type="button">
              회원탈퇴
            </button>
          </div>
        </section>
      </section>

      <BottomNavigation activeTab="setting" onTabChange={onTabChange} />
    </main>
  )
}
