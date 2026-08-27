import { useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent, PointerEvent } from 'react'
import { lightTheme } from '@ict/design-tokens'
import { hospitalSearchMapImage, hospitalSearchPinIcon } from '../../../shared/config/assets'
import { searchHospitals } from '../../../entities/hospital/api/useHospitalApi'
import type { HospitalSearchResult } from '../../../entities/hospital/model/types'
import { project, TILE_SIZE, unproject } from '../../../shared/lib/map'
import { createThemeVars } from '../../../shared/lib/theme'
import { ResourceDetailPage } from '../../pull-request/ui/ResourceDetailPage'
import { HospitalRecommendCard } from './HospitalRecommendCard'
import type { PullReqStatus } from '../../pull-request/ui/PullReqCard'
import type { Coordinate, ScreenPoint } from '../../../shared/lib/map'

type MedicalResource = {
  id: string
  label: string
}

type MapTile = {
  id: string
  src: string
  x: number
  y: number
}

type MapDragState = {
  pointerId: number
  startX: number
  startY: number
  centerWorld: ScreenPoint
}

const SEARCH_MAP_ZOOM = 15
const SEARCH_MAP_WIDTH = 362
const SEARCH_MAP_HEIGHT = 177

const medicalResources: MedicalResource[] = [
  { id: 'obstetrician', label: '산부인과 전문의' },
  { id: 'neonatologist', label: '신생아 전문의' },
  { id: 'operation-room', label: '응급 수술실' },
  { id: 'nicu', label: 'NICU' },
  { id: 'transfusion', label: '수혈' },
]

const fallbackHospitalSearchResults: HospitalSearchResult[] = [
  {
    id: 9101,
    name: 'A대학교병원',
    address: '경기 성남시 분당구 중앙로 100',
    phone: '031-111-1111',
    resourcesContent: 'NICU 20/24 · 수술실 여유 · 수혈 가능',
    resourcesUpdatedAt: '2026-08-27T00:00:00.000Z',
  },
  {
    id: 9102,
    name: 'B대학교병원',
    address: '경기 성남시 수정구 산성대로 200',
    phone: '031-222-2222',
    resourcesContent: 'NICU 14/18 · 수술실 여유 · 산부인과 전문의 대기',
    resourcesUpdatedAt: '2026-08-27T00:00:00.000Z',
  },
  {
    id: 9103,
    name: 'C대학교병원',
    address: '서울 송파구 올림픽로 300',
    phone: '02-333-3333',
    resourcesContent: 'NICU 8/12 · 수술실 확인중 · 수혈 가능',
    resourcesUpdatedAt: '2026-08-27T00:00:00.000Z',
  },
  {
    id: 9104,
    name: 'D여성병원',
    address: '경기 용인시 수지구 포은대로 400',
    phone: '031-444-4444',
    resourcesContent: 'NICU 6/10 · 분만실 여유 · 신생아 전문의 대기',
    resourcesUpdatedAt: '2026-08-27T00:00:00.000Z',
  },
]

function normalizeHospitalSearchText(value: string) {
  return value.replace(/\s/g, '').toLowerCase()
}

function getFallbackHospitalSearchResults(keyword: string) {
  const normalizedKeyword = normalizeHospitalSearchText(keyword)

  if (!normalizedKeyword) {
    return []
  }

  return fallbackHospitalSearchResults.filter((hospital) => {
    const searchableText = normalizeHospitalSearchText(
      `${hospital.name} ${hospital.address} ${hospital.phone} ${hospital.resourcesContent}`,
    )

    return searchableText.includes(normalizedKeyword)
  })
}

type HospitalRequestRouteState = {
  hospitalRequest?: {
    title: string
    status: PullReqStatus
    description: string
    currentLocation: string
  }
}

function isPullReqStatus(value: unknown): value is PullReqStatus {
  return value === '진행중' || value === '응답대기' || value === '완료' || value === '취소'
}

function getHospitalRequestFromRouteState() {
  const hospitalRequest = (window.history.state as HospitalRequestRouteState | null)?.hospitalRequest

  if (
    !hospitalRequest ||
    typeof hospitalRequest.title !== 'string' ||
    !isPullReqStatus(hospitalRequest.status) ||
    typeof hospitalRequest.description !== 'string' ||
    typeof hospitalRequest.currentLocation !== 'string'
  ) {
    return null
  }

  return hospitalRequest
}

function navigateToPullRequest() {
  window.history.pushState(null, '', '/pull-request')
  window.dispatchEvent(new PopStateEvent('popstate'))
}

function createCurrentLocationTiles(latitude: number, longitude: number): MapTile[] {
  const center = project({ lat: latitude, lng: longitude }, SEARCH_MAP_ZOOM)
  const topLeft = {
    x: center.x - SEARCH_MAP_WIDTH / 2,
    y: center.y - SEARCH_MAP_HEIGHT / 2,
  }
  const minTileX = Math.floor(topLeft.x / TILE_SIZE)
  const maxTileX = Math.floor((topLeft.x + SEARCH_MAP_WIDTH) / TILE_SIZE)
  const minTileY = Math.floor(topLeft.y / TILE_SIZE)
  const maxTileY = Math.floor((topLeft.y + SEARCH_MAP_HEIGHT) / TILE_SIZE)
  const tileCount = 2 ** SEARCH_MAP_ZOOM
  const tiles: MapTile[] = []

  for (let tileX = minTileX; tileX <= maxTileX; tileX += 1) {
    for (let tileY = minTileY; tileY <= maxTileY; tileY += 1) {
      if (tileY < 0 || tileY >= tileCount) {
        continue
      }

      const wrappedX = ((tileX % tileCount) + tileCount) % tileCount

      tiles.push({
        id: `${SEARCH_MAP_ZOOM}-${tileX}-${tileY}`,
        src: `https://tile.openstreetmap.org/${SEARCH_MAP_ZOOM}/${wrappedX}/${tileY}.png`,
        x: tileX * TILE_SIZE - topLeft.x,
        y: tileY * TILE_SIZE - topLeft.y,
      })
    }
  }

  return tiles
}

function HospitalSearchPage({
  onSearch,
  isSearching,
  searchError,
}: {
  onSearch: (keyword: string) => void
  isSearching: boolean
  searchError: string | null
}) {
  const mapDragRef = useRef<MapDragState | null>(null)
  const [keyword, setKeyword] = useState('')
  const [currentMapCenter, setCurrentMapCenter] = useState<Coordinate | null>(null)
  const [isMapDragging, setIsMapDragging] = useState(false)
  const [locationMessage, setLocationMessage] = useState('현재 위치를 확인하는 중입니다.')
  const trimmedKeyword = keyword.trim()
  const mapTiles = useMemo(
    () => currentMapCenter ? createCurrentLocationTiles(currentMapCenter.lat, currentMapCenter.lng) : [],
    [currentMapCenter],
  )

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setLocationMessage('브라우저에서 현재 위치를 지원하지 않습니다.')
      return
    }

    let isMounted = true

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        if (!isMounted) {
          return
        }

        setCurrentMapCenter({ lat: coords.latitude, lng: coords.longitude })
        setLocationMessage('지도를 드래그해서 검색 위치를 조정할 수 있습니다.')
      },
      (error) => {
        if (!isMounted) {
          return
        }

        setLocationMessage(
          error.code === error.PERMISSION_DENIED
            ? '위치 권한을 허용하면 현재 위치가 표시됩니다.'
            : '현재 위치를 확인하지 못했습니다.',
        )
      },
      {
        enableHighAccuracy: true,
        maximumAge: 60_000,
        timeout: 10_000,
      },
    )

    return () => {
      isMounted = false
    }
  }, [])

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!trimmedKeyword) {
      return
    }

    onSearch(trimmedKeyword)
  }

  const handleMapPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!currentMapCenter || event.button !== 0) {
      return
    }

    event.preventDefault()
    setIsMapDragging(true)
    mapDragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      centerWorld: project(currentMapCenter, SEARCH_MAP_ZOOM),
    }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handleMapPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const dragState = mapDragRef.current

    if (!dragState || dragState.pointerId !== event.pointerId) {
      return
    }

    event.preventDefault()
    setCurrentMapCenter(
      unproject(
        {
          x: dragState.centerWorld.x - (event.clientX - dragState.startX),
          y: dragState.centerWorld.y - (event.clientY - dragState.startY),
        },
        SEARCH_MAP_ZOOM,
      ),
    )
    setLocationMessage('조정한 위치 기준으로 가까운 병원을 검색합니다.')
  }

  const handleMapPointerEnd = (event: PointerEvent<HTMLDivElement>) => {
    if (mapDragRef.current?.pointerId === event.pointerId) {
      mapDragRef.current = null
      setIsMapDragging(false)
    }
  }

  return (
    <div style={createThemeVars()}>
      <main className="transport-page">
        <header className="transport-header">
          <h1>병원 검색</h1>
        </header>

        <section
          aria-label="병원 검색 진행"
          style={{
            minHeight: 0,
            flex: '1 1 auto',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            padding: '27px 20px 28px',
            background: 'var(--fill-alternative)',
          }}
        >
          <div style={{ display: 'grid', gap: '28px' }}>
            <section aria-labelledby="hospital-search-map-title" style={{ display: 'grid', gap: '10px' }}>
              <h2
                id="hospital-search-map-title"
                style={{
                  margin: '0 10px',
                  color: lightTheme.label.normal,
                  fontSize: '18px',
                  fontWeight: 600,
                  lineHeight: 1.3,
                }}
              >
                  내 위치 검색
              </h2>

              <div
                onPointerDown={handleMapPointerDown}
                onPointerMove={handleMapPointerMove}
                onPointerUp={handleMapPointerEnd}
                onPointerCancel={handleMapPointerEnd}
                style={{
                  position: 'relative',
                  height: '177px',
                  border: `1.5px solid ${lightTheme.label.disable}`,
                  borderRadius: '16px',
                  overflow: 'hidden',
                  background: lightTheme.background.elevated.normal,
                  cursor: mapTiles.length > 0 ? (isMapDragging ? 'grabbing' : 'grab') : 'default',
                  touchAction: mapTiles.length > 0 ? 'none' : 'auto',
                }}
              >
                {mapTiles.length > 0 ? (
                  <div aria-label="현재 검색 위치 지도" style={{ position: 'absolute', inset: 0 }}>
                    {mapTiles.map((tile) => (
                      <img
                        key={tile.id}
                        src={tile.src}
                        alt=""
                        draggable="false"
                        style={{
                          position: 'absolute',
                          left: `${tile.x}px`,
                          top: `${tile.y}px`,
                          width: `${TILE_SIZE}px`,
                          height: `${TILE_SIZE}px`,
                          maxWidth: 'none',
                          pointerEvents: 'none',
                          userSelect: 'none',
                        }}
                      />
                    ))}



                    <img
                      src={hospitalSearchPinIcon}
                      alt=""
                      draggable="false"
                      style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        width: '50px',
                        height: '62px',
                        pointerEvents: 'none',
                        transform: 'translate(-50%, -50%)',
                      }}
                    />

                    <span
                      style={{
                        position: 'absolute',
                        right: '6px',
                        top: '6px',
                        padding: '2px 5px',
                        borderRadius: '6px',
                        color: lightTheme.background.elevated.normal,
                        fontSize: '10px',
                        fontWeight: 500,
                        lineHeight: 1.3,
                        background: 'rgb(0 0 0 / 38%)',
                        pointerEvents: 'none',
                      }}
                    >
                      OpenStreetMap
                    </span>
                  </div>
                ) : (
                  <img
                    src={hospitalSearchMapImage}
                    alt=""
                    draggable="false"
                    style={{
                      position: 'absolute',
                      left: '-104px',
                      top: '-203px',
                      width: '515px',
                      height: '708px',
                      maxWidth: 'none',
                      objectFit: 'cover',
                      pointerEvents: 'none',
                    }}
                  />
                )}

                {mapTiles.length === 0 ? (
                  <div
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      left: '132px',
                      top: '22px',
                      width: '106px',
                      height: '106px',
                      borderRadius: '999px',
                      border: `1.5px solid ${lightTheme.primary.normal}`,
                      background: 'rgb(47 96 255 / 10%)',
                    }}
                  />
                ) : null}

                {mapTiles.length === 0 ? (
                  <img
                    src={hospitalSearchPinIcon}
                    alt=""
                    draggable="false"
                    style={{
                      position: 'absolute',
                      left: '154px',
                      top: '44px',
                      width: '62px',
                      height: '62px',
                      pointerEvents: 'none',
                    }}
                  />
                ) : null}

                <span
                  style={{
                    position: 'absolute',
                    left: '8px',
                    right: '8px',
                    bottom: '8px',
                    padding: '4px 8px',
                    borderRadius: '99px',
                    color: lightTheme.background.elevated.normal,
                    fontSize: '13px',
                    fontWeight: 500,
                    lineHeight: 1.3,
                    textAlign: 'center',
                    background: 'rgb(0 0 0 / 44%)',
                    pointerEvents: 'none',
                  }}
                >
                  {locationMessage}
                </span>
              </div>
            </section>

            <form
              aria-labelledby="hospital-search-form-title"
              onSubmit={submitSearch}
              style={{
                borderRadius: '10px',
                display: 'grid',
                gap: '18px',
                padding: '22px 18px',
                background: lightTheme.background.elevated.normal,
              }}
            >
              <div style={{ display: 'grid', gap: '6px' }}>
                <h2
                  id="hospital-search-form-title"
                  style={{
                    margin: 0,
                    color: lightTheme.label.normal,
                    fontSize: '20px',
                    fontWeight: 600,
                    lineHeight: 1.3,
                  }}
                >
                  병원 검색
                </h2>
                <p
                  style={{
                    margin: 0,
                    color: lightTheme.label.alternative,
                    fontSize: '15px',
                    fontWeight: 500,
                    lineHeight: 1.4,
                  }}
                >
                  병원명 또는 지역명을 입력해 수용 가능한 병원을 찾아보세요.
                </p>
              </div>

              <label
                style={{
                  display: 'grid',
                  gap: '8px',
                }}
              >
                <span
                  style={{
                    paddingLeft: '4px',
                    color: lightTheme.label.alternative,
                    fontSize: '14px',
                    fontWeight: 500,
                    lineHeight: 1.3,
                  }}
                >
                  검색어
                </span>
                <input
                  type="search"
                  value={keyword}
                  placeholder="예: A대학교병원, 청주"
                  autoComplete="off"
                  onChange={(event) => setKeyword(event.target.value)}
                  style={{
                    width: '100%',
                    height: '42px',
                    padding: '0 14px',
                    border: `1px solid ${lightTheme.line.neutral}`,
                    borderRadius: '10px',
                    color: lightTheme.label.normal,
                    fontSize: '16px',
                    fontWeight: 400,
                    lineHeight: 1.3,
                    background: lightTheme.background.normal.alternative,
                    outline: 'none',
                  }}
                />
              </label>

              <button
                type="submit"
                disabled={!trimmedKeyword || isSearching}
                style={{
                  width: '100%',
                  height: '42px',
                  border: 0,
                  borderRadius: '10px',
                  color: lightTheme.background.elevated.normal,
                  fontSize: '18px',
                  fontWeight: 500,
                  lineHeight: 1.3,
                  background: lightTheme.primary.normal,
                  opacity: trimmedKeyword && !isSearching ? 1 : 0.45,
                  cursor: trimmedKeyword && !isSearching ? 'pointer' : 'default',
                }}
              >
                {isSearching ? '검색 중...' : '검색'}
              </button>

              {searchError ? (
                <p
                  style={{
                    margin: 0,
                    color: lightTheme.status.destructive,
                    fontSize: '14px',
                    fontWeight: 500,
                    lineHeight: 1.3,
                  }}
                >
                  {searchError}
                </p>
              ) : null}
            </form>
          </div>
        </section>
      </main>
    </div>
  )
}

function CurrentLocationMapSection() {
  const [currentMapCenter, setCurrentMapCenter] = useState<Coordinate | null>(null)
  const [locationMessage, setLocationMessage] = useState('현재 위치를 확인하는 중입니다.')
  const mapTiles = useMemo(
    () => currentMapCenter ? createCurrentLocationTiles(currentMapCenter.lat, currentMapCenter.lng) : [],
    [currentMapCenter],
  )

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setLocationMessage('브라우저에서 현재 위치를 지원하지 않습니다.')
      return
    }

    let isMounted = true

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        if (!isMounted) {
          return
        }

        setCurrentMapCenter({ lat: coords.latitude, lng: coords.longitude })
        setLocationMessage('현재 위치를 지도에 표시하고 있습니다.')
      },
      (error) => {
        if (!isMounted) {
          return
        }

        setLocationMessage(
          error.code === error.PERMISSION_DENIED
            ? '위치 권한을 허용하면 현재 위치가 표시됩니다.'
            : '현재 위치를 확인하지 못했습니다.',
        )
      },
      {
        enableHighAccuracy: true,
        maximumAge: 60_000,
        timeout: 10_000,
      },
    )

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <section
      aria-labelledby="hospital-current-location-title"
      style={{
        display: 'grid',
        gap: '10px',
      }}
    >
      <h2
        id="hospital-current-location-title"
        style={{
          margin: '0 10px',
          color: lightTheme.label.normal,
          fontSize: '18px',
          fontWeight: 600,
          lineHeight: 1.3,
        }}
      >
        내 위치 검색
      </h2>

      <div
        style={{
          position: 'relative',
          height: '177px',
          border: `1.5px solid ${lightTheme.label.disable}`,
          borderRadius: '16px',
          overflow: 'hidden',
          background: lightTheme.background.elevated.normal,
        }}
      >
        {mapTiles.length > 0 ? (
          <div aria-label="현재 위치 지도" style={{ position: 'absolute', inset: 0 }}>
            {mapTiles.map((tile) => (
              <img
                key={tile.id}
                src={tile.src}
                alt=""
                draggable="false"
                style={{
                  position: 'absolute',
                  left: `${tile.x}px`,
                  top: `${tile.y}px`,
                  width: `${TILE_SIZE}px`,
                  height: `${TILE_SIZE}px`,
                  maxWidth: 'none',
                  pointerEvents: 'none',
                  userSelect: 'none',
                }}
              />
            ))}

            <img
              src={hospitalSearchPinIcon}
              alt=""
              draggable="false"
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: '50px',
                height: '62px',
                pointerEvents: 'none',
                transform: 'translate(-50%, -50%)',
              }}
            />

            <span
              style={{
                position: 'absolute',
                right: '6px',
                top: '6px',
                padding: '2px 5px',
                borderRadius: '6px',
                color: lightTheme.background.elevated.normal,
                fontSize: '10px',
                fontWeight: 500,
                lineHeight: 1.3,
                background: 'rgb(0 0 0 / 38%)',
                pointerEvents: 'none',
              }}
            >
              OpenStreetMap
            </span>
          </div>
        ) : (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'grid',
              placeItems: 'center',
              padding: '18px',
              color: lightTheme.label.alternative,
              fontSize: '14px',
              fontWeight: 500,
              lineHeight: 1.4,
              textAlign: 'center',
            }}
          >
            {locationMessage}
          </div>
        )}

        {mapTiles.length > 0 ? (
          <span
            style={{
              position: 'absolute',
              left: '8px',
              right: '8px',
              bottom: '8px',
              padding: '4px 8px',
              borderRadius: '99px',
              color: lightTheme.background.elevated.normal,
              fontSize: '13px',
              fontWeight: 500,
              lineHeight: 1.3,
              textAlign: 'center',
              background: 'rgb(0 0 0 / 44%)',
              pointerEvents: 'none',
            }}
          >
            {locationMessage}
          </span>
        ) : null}
      </div>
    </section>
  )
}

export function HospitalPage() {
  const [hospitalRequest] = useState(() => getHospitalRequestFromRouteState())
  const [searchKeyword, setSearchKeyword] = useState<string | null>(null)
  const [searchedHospitals, setSearchedHospitals] = useState<HospitalSearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const hasSearchedHospitals = searchedHospitals.length > 0

  const handleHospitalSearch = async (keyword: string) => {
    setIsSearching(true)
    setSearchError(null)
    const fallbackHospitals = getFallbackHospitalSearchResults(keyword)

    try {
      const hospitals = await searchHospitals({ keyword })
      setSearchedHospitals(hospitals.length > 0 ? hospitals : fallbackHospitals)
      setSearchKeyword(keyword)
    } catch {
      if (fallbackHospitals.length > 0) {
        setSearchedHospitals(fallbackHospitals)
        setSearchKeyword(keyword)
      } else {
        setSearchError('병원 검색에 실패했습니다. 다시 시도해주세요.')
      }
    } finally {
      setIsSearching(false)
    }
  }

  if (hospitalRequest) {
    return (
      <div style={createThemeVars()}>
        <ResourceDetailPage
          title={hospitalRequest.title}
          status={hospitalRequest.status}
          description={hospitalRequest.description}
          currentLocation={hospitalRequest.currentLocation}
          onBack={navigateToPullRequest}
        />
      </div>
    )
  }

  if (!searchKeyword) {
    return (
      <HospitalSearchPage
        onSearch={handleHospitalSearch}
        isSearching={isSearching}
        searchError={searchError}
      />
    )
  }

  return (
    <div style={createThemeVars()}>
      <main className="transport-page">
        <header className="transport-header">
          <h1>병원 검색 결과</h1>
        </header>

        <section
          aria-label="병원 검색 결과"
          style={{
            minHeight: 0,
            flex: '1 1 auto',
            overflowY: 'auto',
            padding: '27px 20px 28px',
            background: 'var(--fill-alternative)',
          }}
        >
          {hasSearchedHospitals ? (
            <div
              style={{
                display: 'grid',
                gap: '28px',
              }}
            >
              <section
                aria-labelledby="hospital-resource-title"
                style={{
                  display: 'grid',
                  gap: '10px',
                  minWidth: 0,
                }}
              >
                <h2
                  id="hospital-resource-title"
                  style={{
                    margin: '0 10px',
                    color: lightTheme.label.normal,
                    fontSize: '18px',
                    fontWeight: 600,
                    lineHeight: 1.3,
                  }}
                >
                  필요 의료자원
                </h2>

                <div
                  aria-label="필요 의료자원 목록"
                  style={{
                    display: 'flex',
                    gap: '10px',
                    minWidth: 0,
                    margin: '0 -20px',
                    padding: '0 20px',
                    overflowX: 'auto',
                    scrollbarWidth: 'none',
                  }}
                >
                  {medicalResources.map((resource) => (
                    <span
                      key={resource.id}
                      style={{
                        flex: '0 0 auto',
                        padding: '5px 10px',
                        borderRadius: '100px',
                        color: lightTheme.primary.normal,
                        fontSize: '14px',
                        fontWeight: 500,
                        lineHeight: 1.3,
                        background: lightTheme.label.disable,
                      }}
                    >
                      {resource.label}
                    </span>
                  ))}
                </div>
              </section>

              <CurrentLocationMapSection />

            <section
              aria-labelledby="hospital-recommend-title"
              style={{
                display: 'grid',
                gap: '10px',
              }}
            >
              <h2
                id="hospital-recommend-title"
                style={{
                  margin: '0 4px',
                  color: lightTheme.label.normal,
                  fontSize: '18px',
                  fontWeight: 600,
                  lineHeight: 1.3,
                }}
              >
                병원 추천
              </h2>

              <div
                style={{
                  display: 'grid',
                  gap: '12px',
                }}
              >
                {searchedHospitals.map((hospital) => (
                  <HospitalRecommendCard
                    key={hospital.id}
                    name={hospital.name}
                    status="available"
                    address={hospital.address}
                    phone={hospital.phone}
                    resourcesContent={hospital.resourcesContent}
                  />
                ))}
              </div>
            </section>
            </div>
          ) : (
            <p
              style={{
                margin: 0,
                padding: '18px',
                borderRadius: '10px',
                color: lightTheme.label.alternative,
                fontSize: '16px',
                fontWeight: 500,
                lineHeight: 1.4,
                textAlign: 'center',
                background: lightTheme.background.elevated.normal,
              }}
            >
              검색하신 병원의 위치가 안뜹니다
            </p>
          )}
        </section>
      </main>
    </div>
  )
}
