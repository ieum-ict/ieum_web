import './App.css'
import {lightTheme} from "@ict/design-tokens";

function App() {
  return (
    <main className="app-shell">
      <section className="welcome-panel" aria-labelledby="welcome-title">
        <p className="eyebrow">Vite + React + pnpm</p>
        <h1 id="welcome-title">ieum web</h1>
        <p className="description" style={{color: lightTheme.primary.normal}}>
          Capacitor 앱으로 확장하기 좋은 React 기반 웹앱 시작점입니다.
        </p>
      </section>
    </main>
  )
}

export default App
