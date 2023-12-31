'use client'

import { X, Minus, Maximize, AlignHorizontalJustifyCenter } from 'lucide-react'
import * as React from 'react'
import styles from '@/styles/components/TitleBar.module.scss'
import { useAppWindow, useMaximized } from '@/lib/hooks'

export default function TitleBar() {
  const appWindow = useAppWindow()
  const maximized = useMaximized()

  return (
    <header>
      <nav data-tauri-drag-region className={styles.nav} aria-label="Global">
        <div className={styles.app_icon}>
          <img src="/d3bu_icon.png" />
        </div>
        <ul className={styles.icons}>
          <li>
            <button onClick={() => appWindow?.minimize()}>
              <Minus size="16" />
            </button>
          </li>
          <li>
            <button onClick={() => maximized ? appWindow?.unmaximize() : appWindow?.maximize()}>
              <Maximize size="16" />
            </button>
          </li>
          <li>
            <button onClick={() => appWindow?.close()} className={styles.red}>
              <X size="16" />
            </button>
          </li>
        </ul>
      </nav>
    </header>
  )
}