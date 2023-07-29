import './index.scss'
import styles from './ui.module.scss'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Scene } from './scene'
import cx from 'classnames'

function App() {
  const [isLoaded, setIsLoaded] = React.useState<boolean>(false)
  const [isStarting, setIsStarting] = React.useState(false)
  const [isStarted, setIsStarted] = React.useState<boolean>(false)
  const audioRef = React.useRef<HTMLAudioElement>(null)

  const handleStart = () => {
    setIsStarting(true)
    audioRef.current!.play()
    setTimeout(() => setIsStarted(true), 4000)
  }

  return (
    <>
      <div className={cx(styles.overlay, { [styles.hidden]: isStarted })}>
        <div className={cx(styles.foreground, { [styles.isStarting]: isStarting })} />
        <button className={cx(styles.button, { [styles.isStarting]: isStarting })} onClick={handleStart} disabled={isStarting}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M9.525 18.025q-.5.325-1.012.038T8 17.175V6.825q0-.6.513-.888t1.012.038l8.15 5.175q.45.3.45.85t-.45.85l-8.15 5.175ZM10 12Zm0 3.35L15.25 12L10 8.65v6.7Z" /></svg>
        </button>
        <audio src={'/vine-boom.mp3'} ref={audioRef} preload='' />
      </div>
      <Scene isStarted={isLoaded && isStarted} onReady={() => setIsLoaded(true)} />
    </>
  )
}

createRoot(document.getElementById('root')!).render(
  <App />,
)