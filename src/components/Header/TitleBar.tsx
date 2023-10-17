'use client'

import { appWindow } from "@tauri-apps/api/window"
import { X, Minus, Maximize, AlignHorizontalJustifyCenter } from 'lucide-react'
import * as React from 'react'
import styles from '@/styles/components/TitleBar.module.scss'

function minimize() {
  if (typeof window !== 'undefined') {
    appWindow.minimize()
  }
}

async function maximize() {
  if (typeof window !== 'undefined') {
    let maximizeState = await appWindow.isMaximized()

    if (!maximizeState) {
      appWindow.maximize()
    } else {
      appWindow.unmaximize()
    }
  }
}

function hide() {
  if (typeof window !== 'undefined') {
    appWindow.hide()
  }
}

export default class TitleBar extends React.Component {
  render(): React.ReactNode {
    return (
      <header>
        <nav data-tauri-drag-region className={styles.nav} aria-label="Global">
          <div className={styles.app_icon}>
            <AlignHorizontalJustifyCenter />
          </div>
          <ul className={styles.icons}>
            <li>
              <button onClick={minimize}>
                <Minus size="16" />
              </button>
            </li>
            <li>
              <button onClick={maximize}>
                <Maximize size="16" />
              </button>
            </li>
            <li>
              <button onClick={hide} className={styles.red}>
                <X size="16" />
              </button>
            </li>
          </ul>
        </nav>
      </header>
    )
  }
}