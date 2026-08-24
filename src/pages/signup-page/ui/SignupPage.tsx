import { FormEvent, useState } from 'react'
import {
  loginLogoIcon,
  signupEyeOffIcon,
  signupEyeIcon,
  signupRadioIcon,
  signupRadioSelectedIcon,
  statusBatteryIcon,
  statusCellularIcon,
  statusWifiIcon,
} from '../../../shared/config/assets'
import './signup-page.css'

type SignupStep = 1 | 2 | 3
type OrganizationType = 'medical' | 'emergency' | 'partner'

const organizationOptions: Array<{
  id: OrganizationType
  title: string
  description: string
}> = [
  { id: 'medical', title: '의료기관', description: '병원, 의원, 보건소 등' },
  { id: 'emergency', title: '119 / 구급대', description: '119 상황실, 구급대원 등' },
  { id: 'partner', title: '기타 관계자', description: '의료기관 응사자, 협력업체 등' },
]

function navigateTo(path: string) {
  if (window.location.pathname === path) {
    return
  }

  window.history.pushState(null, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

function StatusBar() {
  return (
    <div className="signup-status-bar" aria-hidden="true">
      <div className="signup-status-bar__time">9:41</div>
      <div className="signup-status-bar__spacer" />
      <div className="signup-status-bar__levels">
        <img className="signup-status-bar__cellular" src={statusCellularIcon} alt="" draggable="false" />
        <img className="signup-status-bar__wifi" src={statusWifiIcon} alt="" draggable="false" />
        <img className="signup-status-bar__battery" src={statusBatteryIcon} alt="" draggable="false" />
      </div>
    </div>
  )
}

function HomeIndicator() {
  return (
    <div className="signup-home-indicator" aria-hidden="true">
      <span />
    </div>
  )
}

function SignupHeader({ step }: { step: SignupStep }) {
  return (
    <div className="signup-header">
      <div className="signup-progress-row">
        <div className="signup-progress" aria-hidden="true">
          {[1, 2, 3].map((item) => (
            <span key={item} className={item <= step ? 'is-active' : ''} />
          ))}
        </div>
        <div className="signup-step-count" aria-label={`회원가입 ${step}/3 단계`}>
          <strong>{step}</strong>
          <span>/</span>
          <span>3</span>
        </div>
      </div>
      <p>회원가입</p>
    </div>
  )
}

function SignupField({
  label,
  placeholder,
  type = 'text',
  actionLabel,
  icon,
}: {
  label: string
  placeholder: string
  type?: string
  actionLabel?: string
  icon?: string
}) {
  return (
    <label className="signup-field">
      <span>{label}</span>
      <div className={actionLabel ? 'signup-field__row' : undefined}>
        <div className="signup-input-shell">
          <input type={type} placeholder={placeholder} />
          {icon ? <img className="signup-input-shell__icon" src={icon} alt="" draggable="false" /> : null}
        </div>
        {actionLabel ? (
          <button className="signup-field__side-button" type="button">
            {actionLabel}
          </button>
        ) : null}
      </div>
    </label>
  )
}

function SignupFooter({
  buttonLabel,
  onPrimary,
  showLoginLink = true,
}: {
  buttonLabel: string
  onPrimary: () => void
  showLoginLink?: boolean
}) {
  return (
    <div className="signup-footer">
      <button className="signup-primary-button" type="button" onClick={onPrimary}>
        {buttonLabel}
      </button>
      {showLoginLink ? (
        <div className="signup-login-prompt">
          <span>이미 계정이 있으신가요?</span>
          <button type="button" onClick={() => navigateTo('/login')}>
            로그인
          </button>
        </div>
      ) : null}
    </div>
  )
}

function StepOne({ onNext }: { onNext: () => void }) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isPasswordConfirmVisible, setIsPasswordConfirmVisible] = useState(false)

  return (
    <form
      className="signup-card signup-card--step-one"
      onSubmit={(event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        onNext()
      }}
    >
      <SignupHeader step={1} />

      <div className="signup-form signup-form--step-one">
        <SignupField label="이름" placeholder="이름을 입력해주세요" />
        <SignupField label="아이디" placeholder="아이디를 입력해주세요" actionLabel="중복 확인" />

        <div className="signup-field">
          <span>비밀번호</span>
          <div className="signup-password-group">
            <div className="signup-input-shell">
              <input type={isPasswordVisible ? 'text' : 'password'} placeholder="비밀번호를 입력해주세요" />
              <button
                className="signup-input-shell__icon-button"
                type="button"
                aria-label={isPasswordVisible ? '비밀번호 숨기기' : '비밀번호 보기'}
                aria-pressed={isPasswordVisible}
                onClick={() => setIsPasswordVisible((currentValue) => !currentValue)}
              >
                <img src={isPasswordVisible ? signupEyeOffIcon : signupEyeIcon} alt="" draggable="false" />
              </button>
            </div>
            <div className="signup-input-shell">
              <input
                type={isPasswordConfirmVisible ? 'text' : 'password'}
                placeholder="비밀번호 다시 입력해주세요"
              />
              <button
                className="signup-input-shell__icon-button"
                type="button"
                aria-label={isPasswordConfirmVisible ? '비밀번호 확인 숨기기' : '비밀번호 확인 보기'}
                aria-pressed={isPasswordConfirmVisible}
                onClick={() => setIsPasswordConfirmVisible((currentValue) => !currentValue)}
              >
                <img src={isPasswordConfirmVisible ? signupEyeOffIcon : signupEyeIcon} alt="" draggable="false" />
              </button>
            </div>
          </div>
        </div>

        <SignupField label="전화번호" placeholder="전화번호를 입력해주세요" />

        <SignupField label="이메일" placeholder="이메일을 입력해주세요" type="email" />
      </div>

      <SignupFooter buttonLabel="다음으로" onPrimary={onNext} />
    </form>
  )
}

function StepTwo({ onNext }: { onNext: () => void }) {
  const [selectedType, setSelectedType] = useState<OrganizationType>('medical')

  return (
    <form
      className="signup-card signup-card--step-two"
      onSubmit={(event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        onNext()
      }}
    >
      <SignupHeader step={2} />

      <div className="signup-form signup-form--step-two">
        <div className="signup-field">
          <span>소속 유형</span>
          <div className="signup-organization-list" role="radiogroup" aria-label="소속 유형">
            {organizationOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={selectedType === option.id}
                className="signup-organization-option"
                onClick={() => setSelectedType(option.id)}
              >
                <img
                  src={selectedType === option.id ? signupRadioSelectedIcon : signupRadioIcon}
                  alt=""
                  draggable="false"
                />
                <span>
                  <strong>{option.title}</strong>
                  <small>{option.description}</small>
                </span>
              </button>
            ))}
          </div>
        </div>

        <SignupField label="부서 (선택)" placeholder="부서를 입력해주세요" />
        <SignupField label="소속 의료기관명" placeholder="소속 의료기관명을 입력해주세요" />
        <SignupField label="직책 / 역할 (선택)" placeholder="직책 / 역할을 입력해주세요" />
      </div>

      <SignupFooter buttonLabel="다음으로" onPrimary={onNext} />
    </form>
  )
}

function StepComplete() {
  return (
    <section className="signup-card signup-card--complete" aria-label="회원가입 완료">
      <SignupHeader step={3} />

      <div className="signup-complete-message">
        <img src={loginLogoIcon} alt="" draggable="false" />
        <div>
          <h1>회원가입이 완료되었습니다!</h1>
          <p>
            이송 관리 서비스를 이용할 준비가 완료되었습니다.
            <br />
            로그인 후 서비스를 이용해주세요.
          </p>
        </div>
      </div>

      <SignupFooter buttonLabel="로그인하러 가기" onPrimary={() => navigateTo('/login')} showLoginLink={false} />
    </section>
  )
}

export function SignupPage() {
  const [step, setStep] = useState<SignupStep>(1)

  return (
    <main className="signup-page">
      <StatusBar />

      <section className="signup-page__content" aria-label="회원가입">
        {step === 1 ? <StepOne onNext={() => setStep(2)} /> : null}
        {step === 2 ? <StepTwo onNext={() => setStep(3)} /> : null}
        {step === 3 ? <StepComplete /> : null}
      </section>

      <HomeIndicator />
    </main>
  )
}
