'use client'

import * as React from 'react'
import works from "@/jsons/works.json"
import WorkCard from '@/components/Work/WorkCard'
import styles from '@/styles/app/works.module.scss'
import SearchField from '@/components/Widgets/SearchField'

export default class Works extends React.Component {
  constructor(props: any) {
    super(props)
  }

  render(): React.ReactNode {
    console.log(works)
    return (
      <>
        <h1 className={styles.title}>作品一覧</h1>
        <div className={styles.tab}>
          <button className={styles.tag_sort}>#タグ検索</button>
          <SearchField />
        </div>
        <div className={styles.works}>
          {works.map((e, i) => {
            return (
              <li key={i}><WorkCard key={i} workData={e} /></li>
            )
          })}
        </div>
      </>
    )
  }
}