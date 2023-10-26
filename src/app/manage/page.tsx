'use client'

import styles from '@/styles/app/manage.module.scss'
import React, { useState, useEffect } from 'react'
import { invoke } from '@tauri-apps/api/tauri'
import WorkList from '@/components/Work/WorkItem'
import Work from '@/components/WorkInterface'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter, faAngleUp, faAngleDown, faTrashCan, faPencil, faPlus, faEye, faEyeSlash, faFileExport, faDownload, faFloppyDisk } from '@fortawesome/free-solid-svg-icons'
import { jsonDirectoryPath, jsonFilePath } from '@/components/Global/constants'
import { v4 as uuidv4 } from 'uuid';

export default function Manage() {
  const [worksJsonData, setWorksJsonData] = useState<Work[]>([])
  const [isChanged, setIsChanged] = useState<boolean>(false)
  const [checkingWorks, setCheckingWorks] = useState<string[]>([])
  const defWork: Work = {
    name: "(タイトル未設定)",
    author: "(制作者未設定)",
    description: "ここに作品説明を入力",
    thumbnail: "",
    targetFile: "",
    guid: "",
    url: "",
    pics: [],
    tags: []
  }

  const saveDirectory = async () => {
    const res = await invoke('get_user_document_directory')
    const worksPath = res as string + jsonDirectoryPath
    invoke('compress_folder', {
      folderPath: worksPath,
      zipPath: res + "\\save.zip"
    })
      .catch((e) => {
        console.error(e)
      })
  }

  const addModifyingWork = () => {
    setIsChanged(true)
  }

  const addCheckingWork = (guid: string) => {
    // console.log("add:" + guid)
    if (!checkingWorks.includes(guid)) {
      setCheckingWorks([...checkingWorks, guid])
    }
  }

  const removeCheckingWork = (guid: string) => {
    // console.log("remove:" + guid)
    if (checkingWorks.includes(guid)) {
      const updatedArray = checkingWorks.filter(item => item !== guid);
      setCheckingWorks(updatedArray);
    }
  }

  const deleteCheckingWorks = () => {
    // console.log("DELETE")
    // console.log(checkingWorks)
    let jsonData = [...worksJsonData]
    checkingWorks.map((cwork) => {
      const matchedItemIndex = jsonData.findIndex(item => item.guid === cwork)

      if (matchedItemIndex !== -1) {
        jsonData = [...jsonData.slice(0, matchedItemIndex), ...jsonData.slice(matchedItemIndex + 1)];
      } else {
        console.error("NOT FOUND")
      }
    })

    const checkboxes = document.querySelectorAll('input[type="checkbox"]');

    // 各チェックボックスの状態をクリア
    checkboxes.forEach((checkbox) => {
      if (checkbox instanceof HTMLInputElement) {
        checkbox.checked = false;
      }
    });

    setWorksJsonData(jsonData)
    setCheckingWorks([])
    setIsChanged(true)
  }

  const deleteWork = (guid: string) => {
    const matchedItemIndex = worksJsonData.findIndex(item => item.guid === guid)

    if (matchedItemIndex !== -1) {
      const newData = [...worksJsonData.slice(0, matchedItemIndex), ...worksJsonData.slice(matchedItemIndex + 1)];
      setWorksJsonData(newData)
      setIsChanged(true)
    } else {
      console.error("NOT FOUND")
    }

    const checkboxes = document.querySelectorAll('input[type="checkbox"]');

    // 各チェックボックスの状態をクリア
    checkboxes.forEach((checkbox) => {
      if (checkbox instanceof HTMLInputElement) {
        checkbox.checked = false;
      }
    });
  }

  const updateWork = (guid: string, data: Work) => {
    const matchedItemIndex = worksJsonData.findIndex(item => item.guid === guid)

    if (matchedItemIndex !== -1) {
      let updatedItem = worksJsonData[matchedItemIndex]
      updatedItem = data
      // console.log(updatedItem)
      const updatedData = [...worksJsonData]
      updatedData[matchedItemIndex] = updatedItem
      setWorksJsonData(updatedData)
      setIsChanged(true)
    } else {
      console.error("NOT FOUND")
    }
  }

  const saveArr = () => {
    invoke('get_user_document_directory').then((res) => {
      const worksPath = res as string + jsonDirectoryPath + jsonFilePath

      invoke('save_json_file', { filePath: worksPath, data: worksJsonData })
        .then(() => {
          console.log("SAVED")
          setIsChanged(false)
        }).catch((e) => console.error(e))
    }).catch((e) => console.error(e))
  }

  const addWorkItem = () => {
    const newUUID = uuidv4().toUpperCase()
    const newWork = defWork
    newWork.guid = newUUID
    const updatedArr = [
      ...worksJsonData,
      newWork]
    setWorksJsonData(updatedArr)
    setIsChanged(true)
  }

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

  console.log(isChanged)

  return (
    <div className={`${styles.backfield} ${isChanged ? styles.active : ""}`}>
      <h1 className={styles.title}>登録作品管理</h1>
      <div className={styles.tool_bar}>
        <div>
          <button className={styles.icon}><FontAwesomeIcon icon={faFilter} /></button>
          <button className={styles.icon}><FontAwesomeIcon icon={faAngleUp} /></button>
          <button className={styles.icon}><FontAwesomeIcon icon={faAngleDown} /></button>
          <button onClick={saveArr}
            className={`${styles.icon} ${isChanged ? styles.active : ""}`}><FontAwesomeIcon icon={faFloppyDisk} /></button>
        </div>
        <div>
          <button onClick={saveDirectory} className={styles.icon}><FontAwesomeIcon icon={faDownload} /></button>
          <button className={styles.icon}><FontAwesomeIcon icon={faFileExport} /></button>
          {/* <button disabled className={styles.icon}><FontAwesomeIcon icon={faEyeSlash} /></button> */}
          {/* <button disabled className={styles.icon}><FontAwesomeIcon icon={faEye} /></button> */}
          <button onClick={addWorkItem} className={styles.icon}><FontAwesomeIcon icon={faPlus} /></button>
          {/* <button disabled className={styles.icon}><FontAwesomeIcon icon={faPencil} /></button> */}
          <button onClick={deleteCheckingWorks} className={styles.icon}><FontAwesomeIcon icon={faTrashCan} /></button>
        </div>
      </div>
      <div className={styles.field}>
        <div>
          {worksJsonData.map((e, i) => (
            <div key={i}>
              <div className={styles.cbox}>
                <input key={i}
                  onClick={
                    () => {
                      checkingWorks.includes(e.guid) ?
                        removeCheckingWork(e.guid) :
                        addCheckingWork(e.guid)
                    }}
                  id={"checkbox" + e.guid}
                  type='checkbox'
                  className={styles.check} />
                <label htmlFor={"checkbox" + e.guid} className={styles.checkbox} />
              </div>
              <WorkList
              addModifyingFunction={addModifyingWork}
                addCheckFunction={addCheckingWork}
                removeCheckFunction={removeCheckingWork}
                deletingFunction={deleteWork}
                updatingFunction={updateWork}
                work={e} key={i} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
