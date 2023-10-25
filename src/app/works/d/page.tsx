"use client";

import { useSearchParams } from "next/navigation";
import React, { useState, useEffect } from 'react'
import styles from '@/styles/app/detail.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { jsonDirectoryPath, jsonFilePath } from '@/components/Global/constants'
import { invoke } from '@tauri-apps/api/tauri'
import { convertFileSrc } from '@tauri-apps/api/tauri';
import Work from '@/components/WorkInterface'

export default function Work() {
  const [workJson, setWorkJson] = useState<Work | null>(null)
  const [workFolder, setWorkFolder] = useState<string>()
  const searchParams = useSearchParams();

  useEffect(()=>{
    const id = searchParams.get('id')

    const setup = async () => {
      try {

        const res = await invoke('get_user_document_directory')
        const worksPath = res as string + jsonDirectoryPath + jsonFilePath
        setWorkFolder(res as string)
        const jsonRes = await invoke('read_json_file', { filePath: worksPath })
        const worksData = jsonRes as Work[]

        if (id) {
          const matchedObject = worksData.find(item => item.guid === id);
    
          if (matchedObject) {
            const mWork: Work = matchedObject
            setWorkJson(mWork)
          }
        }

      } catch (error) {
        console.error("Error", error)
      }
    }

    setup()
  },[])

  console.log("PATH:"+workFolder as string + jsonDirectoryPath + "\\" + workJson?.guid  + workJson?.thumbnail)

  return (
    <>
      <h1 className={styles.title}>{workJson?.name}</h1>
      <div className={styles.field}>
        <div className={styles.thumbnail}>
        {workJson?.thumbnail !== "" ?
              (<img
                src={convertFileSrc(workFolder as string + jsonDirectoryPath + "\\" + workJson?.guid  + workJson?.thumbnail)}
                alt='thumbnail'>
              </img>) : ""
            }
        </div>
        <div className={styles.author}>
          <FontAwesomeIcon icon={faUser} className={styles.icon} />{workJson?.author}
        </div>
        <div className={styles.click}><p>Launch</p></div>
        <div className={styles.description}>
          {workJson?.description}
        </div>
      </div>
    </>
  )

}