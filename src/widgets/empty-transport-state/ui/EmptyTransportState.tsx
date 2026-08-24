import type { Transfer } from '../../../entities/transfer/model/types'
import { noTransferEmojiIcon } from '../../../shared/config/assets'

type EmptyTransportStateProps = {
  onPrimaryAction: () => void
  pendingTransfer?: Transfer | null
  onStartTransfer?: () => void
}

export function EmptyTransportState({ onPrimaryAction, pendingTransfer, onStartTransfer }: EmptyTransportStateProps) {
  if (pendingTransfer) {
    return (
      <main className="empty-transport-page">
        <section className="empty-transport-page__content" aria-label="이송 대기 중인 전원 요청">
          <div className="empty-transport-page__hero">
            <img src={noTransferEmojiIcon} alt="" draggable="false" />
            <div className="empty-transport-page__copy">
              <h1>수용 병원이 확정된 이송이 있어요</h1>
              <p>
                {pendingTransfer.patientName} ({pendingTransfer.patientAge}세)
                <br />
                {pendingTransfer.departureAddress}
              </p>
            </div>
          </div>

          <button className="empty-transport-page__action" type="button" onClick={onStartTransfer}>
            이송 시작하기
          </button>
        </section>
      </main>
    )
  }

  return (
    <main className="empty-transport-page">
      <section className="empty-transport-page__content" aria-label="진행 중인 이송 없음">
        <div className="empty-transport-page__hero">
          <img src={noTransferEmojiIcon} alt="" draggable="false" />
          <div className="empty-transport-page__copy">
            <h1>현재 진행 중인 이송이 없습니다</h1>
            <p>
              수용 병원이 확정되면 이곳에서
              <br />
              이송 경로와 환자 상태를 확인할 수 있어요!
            </p>
          </div>
        </div>

        <button className="empty-transport-page__action" type="button" onClick={onPrimaryAction}>
          진행 중인 전원 요청 보기
        </button>
      </section>
    </main>
  )
}
