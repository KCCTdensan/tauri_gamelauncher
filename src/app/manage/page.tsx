'use client'

import styles from '@/styles/app/manage.module.scss'
import React, { useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';

interface Tag {
  name: string
}

interface Work {
  name: string,
  author: string,
  description: string,
  thumbnail: string,
  guid: string,
  tags: Tag[]
}



export default function Manage() {
  let worksPath: string = ""
  let worksJsonData: Work[] = []

  const [opened, setOpened] = useState<boolean>(false)

  let setup = () => {
    invoke('get_user_document_directory')
    .then((res) => {
      console.log(res)
      worksPath = res as string + "\\KCCTGameLauncher\\works.json"
      console.log("w_path:" + worksPath)

      console.log("OPEN:" + worksPath)

      invoke('read_json_file', {
        filePath: worksPath
      }).then((res) => {
        console.log("OpenSuccess")
        console.log(res)
        worksJsonData = res as Work[]
      })
        .catch((e) => {
          console.log("Error")
          console.log(e)
        })

    }).catch((e) => {
      console.log("Error")
      console.log(e)
    })
  }

  setup()

  return (
    <>
      <h1 className={styles.title}>登録作品管理</h1>
      <div className={styles.field}>
        {worksJsonData.map((e, i) => (
          <div key={i} className={styles.work_box}>
            <div>{e.name}</div>
          </div>
        ))}
      </div>
    </>
  )
}