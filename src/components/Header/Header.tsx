/* eslint-disable @next/next/no-img-element */
'use client'

import * as React from 'react'
import Link from 'next/link'
import styles from '@/styles/components/Header.module.scss'
import Image from 'next/image'

export default class Header extends React.Component {
  constructor(props: any) {
    super(props)
  }

  render(): React.ReactNode {
    return (
      <header>
        <div className={styles.header} data-tauri-drag-region>
          <div><Link href="/">
            <img src="/d3bu_icon.png" className={styles.icon} alt='icon'/>
            Game Launcher</Link></div>
          <div>
            <ul>
              <li><Link href="/about">
                電算部とは
              </Link></li>
              <li><Link href="/works">
                作品一覧
              </Link></li>
            </ul>
          </div>
        </div>
      </header>
    )
  }
}