/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from '@/styles/components/WorkCard.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faCalendarDays } from '@fortawesome/free-solid-svg-icons'
import { invoke } from '@tauri-apps/api/tauri'
import { convertFileSrc } from '@tauri-apps/api/tauri';
import { jsonDirectoryPath, jsonFilePath } from '@/components/Global/constants'
import Work, { Pic as PicWork } from '@/components/WorkInterface'

interface Tag {
  name: string
}

interface WorkCardProps {
  workData: {
    name: string,
    author: string,
    description: string,
    thumbnail: string,
    guid: string,
    tags: Tag[]
  }
}

type Props = {
  workData: Work,
}

export default function WorkCard({ workData }: Props) {
  const [workFolder, setWorkFolder] = useState<string>()
  const [thumbnailPath, setThumbnailPath] = useState<string>("")
  useEffect(() => {
    const setup = async () => {
      try {
        const res = await invoke('get_user_document_directory')
        const worksPath = res as string + jsonDirectoryPath + "\\" + workData.guid
        setWorkFolder(worksPath)
        setThumbnailPath(convertFileSrc(worksPath as string + workData.thumbnail))
      } catch (error) {
        console.error("Error", error)
      }
    }

    setup()
  }, [workData.guid, workData.thumbnail])

  const launchWork = () => {
    console.log(workFolder + workData?.targetFile)
    invoke('open_file', { filePath: workFolder + workData?.targetFile })
      .then((res) => console.log(res))
      .catch((e) => console.error(e))
  }

  return (
    <div>
      <Link href={"/works/d?id=" + workData.guid} className={styles.link}>
        <div className={styles.card}>
          {workData.author ? <div className={styles.author}><FontAwesomeIcon icon={faUser} className={styles.icon} />{workData.author}</div> : <></>}
          {workData.year ?<div className={styles.year}><FontAwesomeIcon icon={faCalendarDays} className={styles.icon} />{workData.year}</div> : <></>}
          <div onClick={launchWork} className={styles.click}>Quick Launch</div>
          <div className={styles.thumbnail}>
            {workData.thumbnail !== "" ?
              (<img
                src={thumbnailPath}
                alt='thumbnail'>
              </img>) : ""
            }
          </div>
          <div className={styles.title}>{workData.name}</div>
          <div className={styles.description}>{workData.description}</div>
          <div className={styles.tags_box}>
            <ul className={styles.tags}>
              {workData.tags.map((e, i) => (
                <li key={i} className={styles.tag}>{e.name}</li>
              ))}
            </ul>
          </div>
        </div>
      </Link>
    </div>
  )

}