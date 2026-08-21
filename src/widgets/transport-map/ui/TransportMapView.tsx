import type { MouseEvent, PointerEvent, RefObject, WheelEvent } from 'react'
import { completedChecklist, hospitalSteps } from '../../../entities/transport/model/constants'
import type { ScreenPoint } from '../../../entities/transport/model/types'
import {
  ambulanceImage,
  carIcon,
  checkBoxFillIcon,
  checkBoxIcon,
  clapIcon,
  destinationDotIcon,
  herePinIcon,
  hospitalIcon,
  panelCarIcon,
  reportIcon,
  chevronIcon,
} from '../../../shared/config/assets'
import { BottomNavigation } from '../../bottom-navigation/ui/BottomNavigation'
import type { NavigationTab } from '../../bottom-navigation/ui/BottomNavigation'

type Tile = {
  id: string
  x: number
  y: number
  src: string
}

type TransportMapViewProps = {
  mapRef: RefObject<HTMLDivElement | null>
  tiles: Tile[]
  routePath: string
  ambulancePoint: ScreenPoint
  destinationPoint: ScreenPoint
  durationPoint: ScreenPoint
  ambulanceMarkerSize: number
  zoom: number
  minZoom: number
  maxZoom: number
  isRouteActive: boolean
  isTransportSheetOpen: boolean
  isHospitalSheetOpen: boolean
  isContactSheetOpen: boolean
  isTransferCompleted: boolean
  sheetDragOffset: number
  hospitalSheetDragOffset: number
  contactSheetDragOffset: number
  onMapPointerDown: (event: PointerEvent<HTMLDivElement>) => void
  onMapPointerMove: (event: PointerEvent<HTMLDivElement>) => void
  onMapPointerUp: (event: PointerEvent<HTMLDivElement>) => void
  onMapPointerCancel: (event: PointerEvent<HTMLDivElement>) => void
  onWheel: (event: WheelEvent<HTMLDivElement>) => void
  onAmbulanceClick: (event: MouseEvent<HTMLButtonElement>) => void
  onHospitalCardClick: (event: MouseEvent<HTMLButtonElement>) => void
  onCarActionClick: (event: MouseEvent<HTMLButtonElement>) => void
  onZoomClick: (event: MouseEvent<HTMLButtonElement>, difference: number) => void
  onBackdropClick: () => void
  onHospitalSheetPointerDown: (event: PointerEvent<HTMLElement>) => void
  onHospitalSheetPointerMove: (event: PointerEvent<HTMLElement>) => void
  onHospitalSheetPointerUp: (event: PointerEvent<HTMLElement>) => void
  onCloseHospitalSheet: () => void
  onOpenContactSheet: () => void
  onContactSheetPointerDown: (event: PointerEvent<HTMLElement>) => void
  onContactSheetPointerMove: (event: PointerEvent<HTMLElement>) => void
  onContactSheetPointerUp: (event: PointerEvent<HTMLElement>) => void
  onCloseContactSheet: () => void
  onCloseCompletedTransport: () => void
  onTransportSheetPointerDown: (event: PointerEvent<HTMLElement>) => void
  onTransportSheetPointerMove: (event: PointerEvent<HTMLElement>) => void
  onTransportSheetPointerUp: (event: PointerEvent<HTMLElement>) => void
  onOpenUpdateView: () => void
  onMarkTransferCompleted: (event: MouseEvent<HTMLButtonElement>) => void
  onTabChange: (tab: NavigationTab) => void
}

export function TransportMapView({
  mapRef,
  tiles,
  routePath,
  ambulancePoint,
  destinationPoint,
  durationPoint,
  ambulanceMarkerSize,
  zoom,
  minZoom,
  maxZoom,
  isRouteActive,
  isTransportSheetOpen,
  isHospitalSheetOpen,
  isContactSheetOpen,
  isTransferCompleted,
  sheetDragOffset,
  hospitalSheetDragOffset,
  contactSheetDragOffset,
  onMapPointerDown,
  onMapPointerMove,
  onMapPointerUp,
  onMapPointerCancel,
  onWheel,
  onAmbulanceClick,
  onHospitalCardClick,
  onCarActionClick,
  onZoomClick,
  onBackdropClick,
  onHospitalSheetPointerDown,
  onHospitalSheetPointerMove,
  onHospitalSheetPointerUp,
  onCloseHospitalSheet,
  onOpenContactSheet,
  onContactSheetPointerDown,
  onContactSheetPointerMove,
  onContactSheetPointerUp,
  onCloseContactSheet,
  onCloseCompletedTransport,
  onTransportSheetPointerDown,
  onTransportSheetPointerMove,
  onTransportSheetPointerUp,
  onOpenUpdateView,
  onMarkTransferCompleted,
  onTabChange,
}: TransportMapViewProps) {
  return (
    <main className="transport-page transport-page--with-nav">
      <header className="transport-header">
        <h1>이송 경로 확인</h1>
      </header>

      <section className="transport-map" aria-label="이송 경로 지도">
        <div
          ref={mapRef}
          className="slippy-map"
          onPointerDown={onMapPointerDown}
          onPointerMove={onMapPointerMove}
          onPointerUp={onMapPointerUp}
          onPointerCancel={onMapPointerCancel}
          onWheel={onWheel}
        >
          <div className="tile-layer" aria-hidden="true">
            {tiles.map((tile) => (
              <img
                key={tile.id}
                className="map-tile"
                src={tile.src}
                style={{ transform: `translate(${tile.x}px, ${tile.y}px)` }}
                alt=""
                draggable="false"
              />
            ))}
          </div>

          <svg className="route-layer" aria-hidden="true">
            <path className="transport-route" d={routePath} />
          </svg>

          <button
            className="ambulance-marker-button"
            type="button"
            aria-label="구급차 위치"
            aria-expanded={isRouteActive}
            style={{
              width: `${ambulanceMarkerSize}px`,
              height: `${ambulanceMarkerSize}px`,
              transform: `translate(${ambulancePoint.x - ambulanceMarkerSize / 2}px, ${
                ambulancePoint.y - ambulanceMarkerSize / 2
              }px)`,
            }}
            onPointerDown={(event) => event.stopPropagation()}
            onClick={onAmbulanceClick}
          >
            <img className="ambulance-marker" src={ambulanceImage} alt="" draggable="false" />
          </button>

          <img
            className="destination-dot"
            src={destinationDotIcon}
            style={{ transform: `translate(${destinationPoint.x - 9}px, ${destinationPoint.y - 9}px)` }}
            alt=""
            draggable="false"
          />

          <img
            className="destination-marker"
            src={herePinIcon}
            style={{ transform: `translate(${destinationPoint.x - 30}px, ${destinationPoint.y - 48}px)` }}
            alt="현재 위치"
            draggable="false"
          />

          <div
            className={`duration-badge ${isRouteActive ? 'is-visible' : ''}`}
            style={{ transform: `translate(${durationPoint.x - 33.5}px, ${durationPoint.y - 68}px)` }}
            aria-hidden={!isRouteActive}
          >
            25분
          </div>

          <button
            className="hospital-card"
            type="button"
            aria-label="선정 병원 병원 B 대학교병원"
            aria-expanded={isHospitalSheetOpen}
            onPointerDown={(event) => event.stopPropagation()}
            onClick={onHospitalCardClick}
          >
            <span className="hospital-card__icon">
              <img src={hospitalIcon} alt="" draggable="false" />
            </span>
            <span className="hospital-card__text">
              <strong>선정 병원</strong>
              <span>병원 B (대학교병원)</span>
            </span>
            <img className="hospital-card__chevron" src={chevronIcon} alt="" draggable="false" />
          </button>

          <div
            className="map-controls"
            aria-label="지도 확대 축소"
            onPointerDown={(event) => event.stopPropagation()}
            onPointerMove={(event) => event.stopPropagation()}
            onPointerUp={(event) => event.stopPropagation()}
          >
            <button type="button" onClick={(event) => onZoomClick(event, 1)} aria-label="지도 확대" disabled={zoom >= maxZoom}>
              +
            </button>
            <button type="button" onClick={(event) => onZoomClick(event, -1)} aria-label="지도 축소" disabled={zoom <= minZoom}>
              -
            </button>
          </div>

          <button
            className="car-action"
            type="button"
            aria-label="이송 차량 위치 보기"
            aria-expanded={isTransportSheetOpen || isTransferCompleted}
            onPointerDown={(event) => event.stopPropagation()}
            onClick={onCarActionClick}
          >
            <img src={carIcon} alt="" draggable="false" />
          </button>

          <a className="map-attribution" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">
            © OpenStreetMap
          </a>

          {(isTransportSheetOpen || isHospitalSheetOpen || isContactSheetOpen || isTransferCompleted) && (
            <button
              className="transport-sheet-backdrop"
              type="button"
              aria-label="오버레이 닫기"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={onBackdropClick}
            />
          )}

          <aside
            className={`hospital-sheet ${isHospitalSheetOpen ? 'is-open' : ''} ${hospitalSheetDragOffset > 0 ? 'is-dragging' : ''}`}
            aria-hidden={!isHospitalSheetOpen}
            aria-label="병원 현황"
            style={isHospitalSheetOpen ? { transform: `translateY(${hospitalSheetDragOffset}px)` } : undefined}
            onPointerDown={onHospitalSheetPointerDown}
            onPointerMove={onHospitalSheetPointerMove}
            onPointerUp={onHospitalSheetPointerUp}
            onPointerCancel={onHospitalSheetPointerUp}
          >
            <div className="transport-sheet__handle" aria-hidden="true" />

            <section className="hospital-sheet__summary">
              <div className="hospital-sheet__title-row">
                <div className="hospital-sheet__title-group">
                  <img className="hospital-sheet__report-icon" src={reportIcon} alt="" draggable="false" />
                  <strong>위험 임산부</strong>
                </div>
                <span className="hospital-sheet__status">진행중</span>
              </div>
              <p className="hospital-sheet__meta">28주 1일 · 출혈, 진통</p>
              <div className="hospital-sheet__divider" aria-hidden="true" />
              <div className="hospital-sheet__info">
                <div>
                  <span>요청 시간</span>
                  <strong>2024.01.31 - 10:00</strong>
                </div>
                <div>
                  <span>현재 단계</span>
                  <strong>14팀 대기</strong>
                </div>
              </div>
            </section>

            <section className="hospital-sheet__timeline-card" aria-label="진행 단계">
              <h2>진행 단계</h2>
              <ol className="hospital-sheet__timeline">
                {hospitalSteps.map((step) => (
                  <li key={step.label} className={`hospital-step hospital-step--${step.status}`}>
                    <span className="hospital-step__dot" aria-hidden="true" />
                    <span className="hospital-step__label">{step.label}</span>
                    <span className="hospital-step__time">{step.time}</span>
                  </li>
                ))}
              </ol>
            </section>

            <button className="hospital-sheet__close" type="button" onPointerDown={(event) => event.stopPropagation()} onClick={onCloseHospitalSheet}>
              닫기
            </button>
          </aside>

          <aside className={`hospital-sheet hospital-sheet--completed ${isTransferCompleted ? 'is-open' : ''}`} aria-hidden={!isTransferCompleted} aria-label="이송 완료 현황">
            <div className="transport-sheet__handle" aria-hidden="true" />

            <section className="hospital-sheet__summary hospital-sheet__summary--completed">
              <div className="hospital-sheet__title-row">
                <div className="hospital-sheet__title-group">
                  <img className="hospital-sheet__report-icon" src={reportIcon} alt="" draggable="false" />
                  <strong>위험 임산부</strong>
                </div>
                <span className="hospital-sheet__status hospital-sheet__status--done">완료</span>
              </div>
              <p className="hospital-sheet__meta">28주 1일 · 출혈, 진통</p>
              <div className="hospital-sheet__divider" aria-hidden="true" />
              <div className="hospital-sheet__info hospital-sheet__info--completed">
                <div><span>도착 시간</span><strong>2024.05.21 - 12:29</strong></div>
                <div><span>인계 완료 시간</span><strong>2024.05.21 - 12:36</strong></div>
                <div><span>인계 담당자</span><strong>이수진 간호사</strong></div>
                <div><span>수용 의료진</span><strong>김민철 교수</strong></div>
              </div>
            </section>

            <section className="completed-checklist-card" aria-label="인계 체크리스트">
              <h2>인계 체크리스트</h2>
              <ul className="completed-checklist">
                {completedChecklist.map((item) => (
                  <li key={item.label} className={item.checked ? 'is-checked' : ''}>
                    <img src={item.checked ? checkBoxFillIcon : checkBoxIcon} alt="" draggable="false" />
                    <span>{item.label}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="completed-message" aria-label="인계 완료 안내">
              <img src={clapIcon} alt="" draggable="false" />
              <p>인계가 완료되었습니다. 수고하셨습니다.</p>
            </section>

            <button className="hospital-sheet__close" type="button" onPointerDown={(event) => event.stopPropagation()} onClick={onCloseCompletedTransport}>
              닫기
            </button>
          </aside>

          <aside
            className={`transport-sheet ${isTransportSheetOpen ? 'is-open' : ''} ${sheetDragOffset > 0 ? 'is-dragging' : ''}`}
            aria-hidden={!isTransportSheetOpen}
            aria-label="이송 현황"
            style={isTransportSheetOpen ? { transform: `translateY(${sheetDragOffset}px)` } : undefined}
            onPointerDown={onTransportSheetPointerDown}
            onPointerMove={onTransportSheetPointerMove}
            onPointerUp={onTransportSheetPointerUp}
            onPointerCancel={onTransportSheetPointerUp}
          >
            <div className="transport-sheet__handle" aria-hidden="true" />

            <div className="transport-steps" aria-label="이송 단계">
              <div className="transport-steps__labels">
                <span>요청</span>
                <span>병원 확정</span>
                <span>이송 중</span>
                <span>도착</span>
              </div>
              <div className="transport-steps__track" aria-hidden="true">
                <span className="transport-steps__progress" />
                <span className="transport-steps__knob" />
              </div>
            </div>

            <div className="traffic-card">
              <img src={panelCarIcon} alt="" draggable="false" />
              <p>
                실시간 교통 상황을 반영하여
                <br />
                최적의 경로로 안내합니다.
              </p>
            </div>

            <div className="transport-summary">
              <div>
                <span>예상 도착 시간(ETA)</span>
                <strong>12:28</strong>
              </div>
              <div className="transport-summary__divider" aria-hidden="true" />
              <div>
                <span>남은 거리</span>
                <strong>8.6km</strong>
              </div>
            </div>

            <div className="transport-sheet__actions">
              <div className="transport-sheet__quick-actions">
                <button type="button" onPointerDown={(event) => event.stopPropagation()} onClick={onOpenUpdateView}>
                  업데이트
                </button>
                <button
                  type="button"
                  onPointerDown={(event) => event.stopPropagation()}
                  onClick={onOpenContactSheet}
                >
                  병원 연락
                </button>
              </div>
              <button
                className="transport-sheet__primary-action"
                type="button"
                onPointerDown={(event) => event.stopPropagation()}
                onClick={onMarkTransferCompleted}
              >
                이송 완료
              </button>
            </div>
          </aside>

          <aside
            className={`contact-sheet ${isContactSheetOpen ? 'is-open' : ''} ${contactSheetDragOffset > 0 ? 'is-dragging' : ''}`}
            aria-hidden={!isContactSheetOpen}
            aria-label="병원 연락"
            style={isContactSheetOpen ? { transform: `translateY(${contactSheetDragOffset}px)` } : undefined}
            onPointerDown={onContactSheetPointerDown}
            onPointerMove={onContactSheetPointerMove}
            onPointerUp={onContactSheetPointerUp}
            onPointerCancel={onContactSheetPointerUp}
          >
            <div className="transport-sheet__handle" aria-hidden="true" />
            <div className="contact-sheet__header">
              <strong>병원 연락</strong>
              <span>병원 B (대학교병원)</span>
            </div>
            <div className="contact-sheet__actions">
              <a className="contact-sheet__call" href="tel:0536504194">
                <span>대표전화</span>
                <strong>053-650-4194</strong>
              </a>
              <a className="contact-sheet__call" href="tel:0536504825">
                <span>분만실 직통</span>
                <strong>053-650-4825</strong>
              </a>
            </div>
            <button
              className="contact-sheet__close"
              type="button"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={onCloseContactSheet}
            >
              닫기
            </button>
          </aside>
        </div>
      </section>
      <BottomNavigation activeTab="transfer" onTabChange={onTabChange} />
    </main>
  )
}
