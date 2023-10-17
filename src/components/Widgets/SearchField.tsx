'use client'

import * as React from 'react'
import styles from '@/styles/components/SearchField.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

export default class SearchField extends React.Component {
  constructor(props: any) {
    super(props)
  }

  render(): React.ReactNode {
    return (
      <div className={styles.field}>
        <input
          placeholder={"Press \"/\" to Search"}
          type={"text"}
          className={styles.input}
        />
        <button className={styles.button}>
          <FontAwesomeIcon icon={faMagnifyingGlass} className={styles.search_magnify} />
        </button>
      </div>
    )
  }
}