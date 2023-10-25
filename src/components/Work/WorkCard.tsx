'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from '@/styles/components/WorkCard.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
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
  useEffect(() => {
    const setup = async () => {
      try {
        const res = await invoke('get_user_document_directory')
        const worksPath = res as string + jsonDirectoryPath + "\\" + workData.guid
        setWorkFolder(worksPath)
      } catch (error) {
        console.error("Error", error)
      }
    }

    setup()
  }, [workData.guid])

  return (
    <div>
      <Link href={"/works/d?id=" + workData.guid} className={styles.link}>
        <div className={styles.card}>
          <div className={styles.author}><FontAwesomeIcon icon={faUser} className={styles.icon} />{workData.author}</div>
          <div className={styles.click}>Quick Launch</div> {/* この要素にclient要素をclick時に動作 */}
          <div className={styles.thumbnail}>
            {workData.thumbnail !== "" ?
              (<img
                src={convertFileSrc(workFolder as string + workData.thumbnail)}
                alt='thumbnail'>
              </img>) : ""
            }
          </div>
          <div className={styles.title}>{workData.name}</div>
          <div className={styles.description}>{workData.description}</div>
          <div>
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