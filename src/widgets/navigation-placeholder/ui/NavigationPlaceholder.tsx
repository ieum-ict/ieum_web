import type { NavigationView } from '../../../entities/transport/model/types'

type NavigationPlaceholderProps = {
    activeTab: NavigationView
}

const titles: Record<NavigationView, string> = {
    request: '요청 페이지',
    hospital: '병원 페이지',
    setting: '설정 페이지',
}

export function NavigationPlaceholder({ activeTab }: NavigationPlaceholderProps) {
    return (
        <main className="empty-transport-page">
            <section className="navigation-placeholder" aria-label={titles[activeTab]}>
                <h1>{titles[activeTab]}</h1>
            </section>
        </main>
    )
}
