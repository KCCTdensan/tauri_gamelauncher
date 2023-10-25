'use client'

import React, { useState, useEffect } from 'react'
// import works from "@/jsons/works.json"
import WorkCard from '@/components/Work/WorkCard'
import styles from '@/styles/app/works.module.scss'
import Work from '@/components/WorkInterface'
import { invoke } from '@tauri-apps/api/tauri'
import { jsonDirectoryPath, jsonFilePath } from '@/components/Global/constants'
import SearchField from '@/components/Widgets/SearchField'

export default function WorksList() {

  const [worksJsonData, setWorksJsonData] = useState<Work[]>([])

  useEffect(() => {
    const setup = async () => {
      try {
        const res = await invoke('get_user_document_directory')
        const worksPath = res as string + jsonDirectoryPath + jsonFilePath
        const jsonRes = await invoke('read_json_file', { filePath: worksPath })
        const worksData = jsonRes as Work[]
        setWorksJsonData(worksData)
      } catch (error) {
        console.error("Error", error)
      }
    }

    setup()
  }, [])

  return (
    <>
      <h1 className={styles.title}>作品一覧</h1>
      <div className={styles.tab}>
        <button className={styles.tag_sort}>#タグ検索</button>
        <SearchField />
      </div>
      <div className={styles.works}>
        {worksJsonData.map((e, i) => {
          return (
            <li key={i}><WorkCard key={i} workData={e} /></li>
          )
        })}
      </div>
    </>
  )

}