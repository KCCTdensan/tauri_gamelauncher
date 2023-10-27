"use client";

import { useSearchParams } from "next/navigation";
import React, { useState, useEffect } from 'react'
import Link from "next/link";
import styles from '@/styles/app/detail.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faGlobe } from '@fortawesome/free-solid-svg-icons'
import { jsonDirectoryPath, jsonFilePath } from '@/components/Global/constants'
import { invoke } from '@tauri-apps/api/tauri'
import { convertFileSrc } from '@tauri-apps/api/tauri';
import Work from '@/components/WorkInterface'
import { QRCodeSVG } from 'qrcode.react';

export default function Work() {
  const [workJson, setWorkJson] = useState<Work | null>(null)
  const [workFolder, setWorkFolder] = useState<string>("")
  const [thumbnailPath, setThumbnailPath] = useState<string>("")
  const searchParams = useSearchParams();

  const launchWork = () => {
    console.log(workFolder + jsonDirectoryPath + "\\" + workJson?.guid + workJson?.targetFile)
    invoke('open_file', { filePath: workFolder + jsonDirectoryPath + "\\" + workJson?.guid + workJson?.targetFile })
      .then((res) => console.log(res))
      .catch((e) => console.error(e))
  }

  useEffect(() => {
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
            setThumbnailPath(convertFileSrc(res as string + jsonDirectoryPath + "\\" + mWork.guid + mWork.thumbnail))
          }
        }

      } catch (error) {
        console.error("Error", error)
      }
    }

    setup()
  }, [])

  console.log("PATH:" + workFolder as string + jsonDirectoryPath + "\\" + workJson?.guid + workJson?.thumbnail)
  // console.log(workFolder as string + jsonDirectoryPath + "\\" + workJson?.guid + e)
  console.log(thumbnailPath)
  return (
    <>
      <h1 className={styles.title}>{workJson?.name}</h1>
      <div className={styles.field}>
        <div className={styles.thumbnail}>
          {workJson?.thumbnail !== "" ?
            (<img
              src={thumbnailPath}
              alt='thumbnail'>
            </img>) : ""
          }
        </div>
        <div className={styles.author}>
          <FontAwesomeIcon icon={faUser} className={styles.icon} />{workJson?.author}
        </div>
        {workJson?.url !== "" ?
          <div className={styles.website}>
            <FontAwesomeIcon icon={faGlobe} className={styles.icon} />
            <Link target="_blank" rel="noopener noreferrer" href={workJson ? workJson?.url as string : "https://d3bu.net"}>{workJson?.url as string}</Link>
            <div><QRCodeSVG value={workJson ? workJson?.url as string : "https://d3bu.net"} size={64} bgColor="rgb(9, 180, 163)" fgColor="#fff" /></div>
          </div> : <></>
        }


        <div onClick={launchWork} className={styles.click}><p>Launch</p></div>
        <div className={styles.description}>
          {workJson?.description}
        </div>
        <div className={styles.tags_box}>
          <ul className={styles.tags}>
            {workJson?.tags.map((e, i) => (
              <li key={i} className={styles.tag}>{e.name}</li>
            ))}
          </ul>
        </div>
        <div className={styles.pics}>
          {
            workJson?.pics ?
            workJson?.pics.map((e, i) => (
              <div key={i} className={styles.pic}>
                <img
                  src={convertFileSrc(
                    workFolder as string + jsonDirectoryPath + "\\" + workJson?.guid + e.path
                  )} ></img>
              </div>
            ) ): <></>
          }
        </div>
      </div>
    </>
  )

}