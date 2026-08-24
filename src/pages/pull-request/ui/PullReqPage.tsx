import { useState } from 'react'
import { lightTheme } from '@ict/design-tokens'
import { createTransfer } from '../../../entities/transfer/api/transferApi'
import { plusIcon } from '../../../shared/config/assets'
import { createThemeVars } from '../../../shared/lib/theme'
import '../../../App.css'
import { usePullRequests } from '../model/usePullRequests'
import type { PullReqListItem } from '../model/usePullRequests'
import { buildCreateTransferPayload, validateRequestDraftForm } from '../model/requestDraftForm'
import type { RequestDraftForm } from '../model/requestDraftForm'
import { InputInformation } from './input-info/InputInformation'
import { PullReqCard } from './PullReqCard'
import { PullReqDetailPage } from './PullReqDetailPage'
import type { PullReqStatus } from './PullReqCard'

type PullReqFilter = '전체' | PullReqStatus

const pullReqFilters: PullReqFilter[] = ['전체', '진행중', '대기중', '완료']

export const PullReqPage = () => {
  const [selectedFilter, setSelectedFilter] = useState<PullReqFilter>('전체')
  const [isInputOpen, setIsInputOpen] = useState(false)
  const [selectedPullReqItem, setSelectedPullReqItem] = useState<PullReqListItem | null>(null)
  const [isSavingRequest, setIsSavingRequest] = useState(false)
  const [saveRequestError, setSaveRequestError] = useState<string | null>(null)
  const { items: pullReqItems, isLoading, error, refetch } = usePullRequests()
  const filteredPullReqItems =
    selectedFilter === '전체' ? pullReqItems : pullReqItems.filter((item) => item.status === selectedFilter)

  const closeInputForm = () => {
    if (window.location.pathname !== '/pull-request') {
      window.history.replaceState(null, '', '/pull-request')
    }

    setIsInputOpen(false)
    setSaveRequestError(null)
    void refetch()
  }

  const handleSaveRequest = async (form: RequestDraftForm) => {
    const validationError = validateRequestDraftForm(form)

    if (validationError) {
      setSaveRequestError(validationError)
      return
    }

    setIsSavingRequest(true)
    setSaveRequestError(null)

    try {
      await createTransfer(buildCreateTransferPayload(form))
      closeInputForm()
    } catch {
      setSaveRequestError('전원 요청 저장에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsSavingRequest(false)
    }
  }

  if (isInputOpen) {
    return (
      <div style={createThemeVars()}>
        <InputInformation
          onBack={() => setIsInputOpen(false)}
          onSave={handleSaveRequest}
          isSaving={isSavingRequest}
          saveError={saveRequestError}
        />
      </div>
    )
  }

  if (selectedPullReqItem) {
    return (
      <div style={createThemeVars()}>
        <PullReqDetailPage
          title={selectedPullReqItem.title}
          status={selectedPullReqItem.status}
          description={selectedPullReqItem.description}
          requestedAt={selectedPullReqItem.requestedAt}
        />
      </div>
    )
  }

  return (
    <div style={createThemeVars()}>
      <main className="transport-page" style={{ position: 'relative' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            padding: '16px 20px 12px',
            background: 'var(--fill-alternative)',
          }}
        >
          <p
            style={{
              width: '100%',
              margin: 0,
              color: lightTheme.label.neutral,
              fontSize: '20px',
              fontWeight: 600,
              lineHeight: 1.3,
            }}
          >
            전원 요청
          </p>

          <div
            role="tablist"
            aria-label="이송 요청 상태 필터"
            style={{
              width: '100%',
              height: '43px',
              padding: '5px',
              borderRadius: '10px',
              display: 'grid',
              gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
              gap: '6px',
              background: lightTheme.line.neutral,
            }}
          >
            {pullReqFilters.map((filter) => {
              const isSelected = selectedFilter === filter

              return (
                <button
                  key={filter}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setSelectedFilter(filter)}
                  style={{
                    minWidth: 0,
                    height: '33px',
                    padding: 0,
                    border: 0,
                    borderRadius: '10px',
                    color: isSelected ? lightTheme.label.neutral : lightTheme.interaction.inactive,
                    fontSize: '16px',
                    fontWeight: 500,
                    lineHeight: 1.3,
                    background: isSelected ? lightTheme.background.normal.normal : 'transparent',
                    cursor: 'pointer',
                  }}
                >
                  {filter}
                </button>
              )
            })}
          </div>
        </div>

        <section
          aria-label="이송 요청 목록"
          style={{
            minHeight: 0,
            flex: '1 1 auto',
            overflowY: 'auto',
            padding: '20px',
            background: 'var(--fill-alternative)',
          }}
        >
          <div
            style={{
              display: 'grid',
              gap: '12px',
            }}
          >
            {isLoading ? (
              <p style={{ margin: 0, color: lightTheme.label.alternative, fontSize: '15px' }}>
                불러오는 중...
              </p>
            ) : error ? (
              <p style={{ margin: 0, color: lightTheme.status.destructive, fontSize: '15px' }}>{error}</p>
            ) : filteredPullReqItems.length === 0 ? (
              <p style={{ margin: 0, color: lightTheme.label.alternative, fontSize: '15px' }}>
                전원 요청이 없습니다.
              </p>
            ) : (
              filteredPullReqItems.map((item) => (
                <PullReqCard
                  key={item.id}
                  title={item.title}
                  status={item.status}
                  description={item.description}
                  location={item.location}
                  requestedMinutesAgo={item.requestedMinutesAgo}
                  onClick={() => setSelectedPullReqItem(item)}
                />
              ))
            )}
          </div>
        </section>

        <button
          type="button"
          aria-label="전원 요청 정보 입력"
          onClick={() => setIsInputOpen(true)}
          style={{
            position: 'absolute',
            right: '20px',
            bottom: '20px',
            zIndex: 2,
            width: '58px',
            height: '58px',
            padding: 0,
            border: 0,
            borderRadius: '100px',
            display: 'grid',
            placeItems: 'center',
            background: lightTheme.primary.normal,
            boxShadow: '0 2px 4px rgb(0 0 0 / 25%)',
            cursor: 'pointer',
          }}
        >
          <span
            style={{
              width: '44px',
              height: '44px',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <img
              src={plusIcon}
              alt=""
              draggable="false"
              style={{
                width: '25.67px',
                height: '25.67px',
              }}
            />
          </span>
        </button>
      </main>
    </div>
  )
}
