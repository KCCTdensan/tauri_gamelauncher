'use client'

import styles from '@/styles/components/WorkItem.module.scss'
import React, { useState, useEffect } from 'react'
import { invoke } from '@tauri-apps/api/tauri'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan, faPencil } from '@fortawesome/free-solid-svg-icons'
import { open } from '@tauri-apps/api/dialog'
import { convertFileSrc } from '@tauri-apps/api/tauri';
import { jsonDirectoryPath, jsonFilePath } from '@/components/Global/constants'
import Work, { Pic as PicWork, Tag } from '@/components/WorkInterface'

type Props = {
  work: Work,
  updatingFunction: Function
  deletingFunction: Function
  addCheckFunction: Function
  removeCheckFunction: Function
  addModifyingFunction: Function
  // removeModifyingFunction: Function
}

export default function WorkList({ work, updatingFunction, deletingFunction, addCheckFunction, removeCheckFunction, addModifyingFunction }: Props) {
  const [isModifying, setIsModifying] = useState<boolean>(false)
  // const [isDeleting, setIsDeleting] = useState<boolean>(false)
  const [currentWork, setCurrentWork] = useState<Work>(work)
  const [workFolder, setWorkFolder] = useState<string>()
  // const [isChecked, setIsChecked] = useState<boolean>(isChecking)

  // const workFolder: unknown = invoke('get_user_document_directory') 
  // console.log("WORK"+workFolder as string)

  useEffect(() => {
    const setup = async () => {
      try {
        const res = await invoke('get_user_document_directory')
        const worksPath = res as string + jsonDirectoryPath + "\\" + work.guid
        setWorkFolder(worksPath)
      } catch (error) {
        console.error("Error", error)
      }
    }

    setup()
  }, [work.guid])

  const handleInputChange = async (e: any) => {
    const { name, value } = e.target;

    const stringName = name as string
    if (stringName === "tags") {
      const tagString = value as string
      const tagsArray = tagString.split(",")
      const tags: Tag[] = []
      tagsArray.map((e)=> {
        const tag: Tag = {
          name: e
        }
        tags.push(tag)
      })
      setCurrentWork({ ...currentWork, tags: tags });
    } else
      setCurrentWork({ ...currentWork, [name]: value });
  };

  const handleFolderUpload = async (e: any) => {

    open().then(files => {
      if (files !== null) {
        // console.log(files)
        invoke('upload_main_directory', { filePath: files, dirPath: workFolder })
          .catch((e) => console.error(e))
      }
    })
  };

  const handleLaunchingFileSelected = async (e: any) => {
    open().then(files => {
      if (files !== null) {
        invoke('get_user_document_directory').then((res) => {
          const workPath = res as string + jsonDirectoryPath + "\\" + work.guid
          // console.log("files" + files)
          // console.log("workPath" + workPath)
          const filePathString = files as string
          const relativePath = filePathString.replace(workFolder as string, '');

          // console.log("relativePath" + relativePath)
          setCurrentWork({ ...currentWork, targetFile: relativePath });
        })
      }
    })
  }

  const handleThumbnailUpload = async (e: any) => {
    open({
      multiple: false,
      filters: [
        {
          name: "Image File",
          extensions: ["jpg", "png", "gif", "webp", "svg", "bmp", "tiff"]
        }
      ]
    }).then(files => {
      if (files !== null) {
        invoke('upload_thumbnail_to_folder', { filePath: files, dirPath: workFolder })
          .then((res) => {
            const filePathString = res as string
            const relativePath = filePathString.replace(workFolder as string, '');
            // console.log(relativePath)
            setCurrentWork({ ...currentWork, thumbnail: relativePath });
          })
          .catch((e) => console.error(e))
      }
    })
  }

  const handleImagesUpload = async (e: any) => {
    const pics: PicWork[] = []
    open({
      multiple: true,
      filters: [
        {
          name: "Image File",
          extensions: ["jpg", "png", "gif", "webp", "svg", "bmp", "tiff"]
        }
      ]
    }).then((files) => {
      const filesAsArray = files as string[]
      filesAsArray.map((file) => {
        if (file !== null) {
          invoke('upload_thumbnail_to_folder', { filePath: file, dirPath: workFolder })
            .then((res) => {
              const filePathString = res as string
              const relativePath = filePathString.replace(workFolder as string, '');
              // console.log(relativePath)
              // setCurrentWork({ ...currentWork, thumbnail: relativePath });
              const pic: PicWork = {
                path: relativePath
              }
              pics.push(pic)
            })
            .catch((e) => console.error(e))
        }
      })

      // setCurrentWork({ ...currentWork, thumbnail: currentWork.thumbnail });

    }).then(() => {
      setCurrentWork({ ...currentWork, pics: pics });
      // console.log("Yahoooooo")
    })
  }

  // const checkingWorkExecute = (e: any) => {

  //   const newState = !isChecked

  //   if (newState) {
  //     addCheckFunction(work.guid)
  //   }else {
  //     removeCheckFunction(work.guid)
  //   }

  //   setIsChecked(newState)
  // }

  // console.log(currentWork)
  // if (currentWork.pics[0])
  //   console.log(workFolder as string + currentWork.pics[0].path)

  return (
    <div className={`${styles.box} ${isModifying ? styles.expanded : ''}`}>
      <div className={styles.eye}></div>
      <div className={styles.id_box}>{work.guid}</div>
      <div className={styles.title}>{work.name}</div>
      <div className={styles.author}>{work.author}</div>
      <div className={`${isModifying ? styles.active : ''} ${styles.modify}`}
        onClick={!isModifying ?
          () => { setIsModifying(!isModifying); addModifyingFunction() } :
          () => { updatingFunction(currentWork.guid, currentWork); setIsModifying(!isModifying) }}>
        <FontAwesomeIcon className={`${isModifying ? styles.active : ''}`} icon={faPencil} /></div>
      {/* <div className={`${isDeleting ? styles.active : ''} ${styles.delete}`} */}
      <div className={`${styles.delete}`}
        // onClick={() => { deletingFunction(work.guid); setIsDeleting(!isDeleting); }}><FontAwesomeIcon className={`${isDeleting ? styles.active : ''}`} icon={faTrashCan} /></div>
        onClick={() => { setIsModifying(false); deletingFunction(work.guid); }}><FontAwesomeIcon icon={faTrashCan} /></div>
      {isModifying ? (
        <div className={styles.modify_field}>
          <div>
            <span className={styles.label}>名前</span>
            <input name='name' onChange={handleInputChange} defaultValue={work.name} />
          </div>
          <div>
            <span className={styles.label}>著者</span>
            <input name='author' onChange={handleInputChange} defaultValue={work.author} />
          </div>
          <div>
            <span className={styles.label}>説明文</span>
            <textarea name='description' onChange={handleInputChange} defaultValue={work.description} rows={5} placeholder='複数行入力可能' />
          </div>
          <div>
            <span className={styles.label}>タグ</span>
            <input name='tags' onChange={handleInputChange}  defaultValue={work.tags.map((tag) => tag.name).join(',')} placeholder='複数の場合、[,]で区切る ex) Game,Shooting' />
          </div>
          <div>
            <span className={styles.label}>URL</span>
            <input name='url' onChange={handleInputChange} defaultValue={work.url} placeholder='https://example.com' />
          </div>
          <div>
            <span className={styles.label}>zip/file</span>
            <span className={styles.option}><button onClick={handleFolderUpload} type="button">UPLOAD</button>&nbsp;ディレクトリはZIPで</span>
            {/* <span><input onChange={handleFileChange} type="file" /></span> */}
          </div>
          <div>
            <span className={styles.label}>起動対象</span>
            <span className={styles.option}><button onClick={handleLaunchingFileSelected} type="button">SELECT</button>
              &nbsp;{currentWork.targetFile === '' ? (<>ファイルが選択されていません</>) : currentWork.targetFile}</span>
          </div>
          <div>
            <span className={styles.label}>サムネイル</span>
            <span className={styles.option}><button onClick={handleThumbnailUpload} type="button">UPLOAD</button>
              &nbsp;<button className={styles.short} onClick={() => { setCurrentWork({ ...currentWork, thumbnail: "" }) }}>削除</button>
              &nbsp;{currentWork.thumbnail === '' ? (<>ファイルが選択されていません</>) : currentWork.thumbnail}</span>
            <div className={styles.images}>
              <span className={styles.image}>
                {currentWork.thumbnail !== "" ? (
                  <img
                    loading="lazy"
                    src={convertFileSrc(workFolder as string + currentWork.thumbnail)}
                    alt='thumbnail'>
                  </img>
                ) : ""}</span>
            </div>
          </div>
          <div>
            <span className={styles.label}>補足画像</span>
            <span className={styles.option}><button onClick={handleImagesUpload} type="button">UPLOAD</button>
              &nbsp;<button className={styles.short} onClick={() => { setCurrentWork({ ...currentWork, name: currentWork.name }) }}>更新</button>
              &nbsp;<button className={styles.short} onClick={() => { setCurrentWork({ ...currentWork, pics: [] }) }}>削除</button>
              &nbsp;{currentWork.pics.length < 1 ? (<>ファイルが選択されていません</>) : (<>現在の選択数: {currentWork.pics.length}</>)}
            </span>
            <div className={styles.images}>
              <span className={styles.image}>
                {
                  currentWork.pics[0] ? (
                    <img
                      src={convertFileSrc(workFolder as string + currentWork.pics[0].path)}
                      alt={currentWork.pics[0].path}>
                    </img>
                  ) : ""
                }
              </span>
              <span className={styles.image}>
                {
                  currentWork.pics[1] ? (
                    <img
                      src={convertFileSrc(workFolder as string + currentWork.pics[1].path)}
                      alt={currentWork.pics[1].path}>
                    </img>
                  ) : ""
                }
              </span>
              <span className={styles.image}>
                {
                  currentWork.pics[2] ? (
                    <img
                      src={convertFileSrc(workFolder as string + currentWork.pics[2].path)}
                      alt={currentWork.pics[2].path}>
                    </img>
                  ) : ""
                }
              </span>
            </div>
          </div>
        </div>

      ) : (<div></div>)
      }
    </div >
  )
}