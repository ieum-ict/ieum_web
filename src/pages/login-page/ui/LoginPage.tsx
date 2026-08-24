import { FormEvent, useState } from 'react'
import {
  loginGoogleIcon,
  loginKakaoIcon,
  loginLogoIcon,
  loginNaverIcon,
  statusBatteryIcon,
  statusCellularIcon,
  statusWifiIcon,
} from '../../../shared/config/assets'
import './login-page.css'

const errorMessage =
  '아이디 또는 비밀번호를 다시 확인하세요. 등록되지 않은 이메일이거나, 이메일 또는 비밀번호를 잘못 입력하셨습니다.'

function StatusBar() {
  return (
    <div className="login-status-bar" aria-hidden="true">
      <div className="login-status-bar__time">9:41</div>
      <div className="login-status-bar__spacer" />
      <div className="login-status-bar__levels">
        <img className="login-status-bar__cellular" src={statusCellularIcon} alt="" draggable="false" />
        <img className="login-status-bar__wifi" src={statusWifiIcon} alt="" draggable="false" />
        <img className="login-status-bar__battery" src={statusBatteryIcon} alt="" draggable="false" />
      </div>
    </div>
  )
}

export function LoginPage() {
  const [loginId, setLoginId] = useState('')
  const [password, setPassword] = useState('')
  const [hasError, setHasError] = useState(false)

  const clearError = () => {
    if (hasError) {
      setHasError(false)
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setHasError(true)
  }

  return (
    <main className="login-page">
      <StatusBar />

      <section className="login-page__content" aria-label="로그인">
        <form className="login-card" onSubmit={handleSubmit} noValidate>
          <div className="login-card__top">
            <div className="login-brand" aria-label="이음 로그인">
              <img className="login-brand__logo" src={loginLogoIcon} alt="" draggable="false" />
              <p>로그인</p>
            </div>

            <div className="login-form-block">
              <div className="login-fields">
                <label className="login-field">
                  <span>아이디</span>
                  <input
                    className={hasError ? 'is-invalid' : ''}
                    type="text"
                    value={loginId}
                    placeholder="아이디"
                    autoComplete="username"
                    aria-invalid={hasError}
                    onChange={(event) => {
                      setLoginId(event.target.value)
                      clearError()
                    }}
                  />
                </label>

                <label className="login-field">
                  <span>비밀번호</span>
                  <input
                    className={hasError ? 'is-invalid' : ''}
                    type="password"
                    value={password}
                    placeholder="비밀번호"
                    autoComplete="current-password"
                    aria-invalid={hasError}
                    aria-describedby={hasError ? 'login-error-message' : undefined}
                    onChange={(event) => {
                      setPassword(event.target.value)
                      clearError()
                    }}
                  />
                  {hasError ? (
                    <span id="login-error-message" className="login-field__error" role="alert">
                      {errorMessage}
                    </span>
                  ) : null}
                </label>
              </div>

              <div className="login-signup-prompt">
                <span>아직 계정이 없으신가요?</span>
                <button type="button">회원가입</button>
              </div>
            </div>
          </div>

          <div className="login-card__bottom">
            <button className="login-submit" type="submit">
              로그인
            </button>

            <div className="login-divider">
              <span />
              <p>또는 다음으로 로그인</p>
              <span />
            </div>

            <div className="login-socials" aria-label="소셜 로그인">
              <button className="login-social login-social--kakao" type="button" aria-label="카카오로 로그인">
                <img src={loginKakaoIcon} alt="" draggable="false" />
              </button>
              <button className="login-social login-social--naver" type="button" aria-label="네이버로 로그인">
                <img src={loginNaverIcon} alt="" draggable="false" />
              </button>
              <button className="login-social login-social--google" type="button" aria-label="구글로 로그인">
                <img src={loginGoogleIcon} alt="" draggable="false" />
              </button>
            </div>
          </div>
        </form>
      </section>

      <div className="login-home-indicator" aria-hidden="true">
        <span />
      </div>
    </main>
  )
}
