'use client'

import styles from '@/styles/components/SearchField.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import React, { useState, useEffect, useRef, Ref } from 'react'
import { jsonDirectoryPath, jsonFilePath } from '@/components/Global/constants'
import Work, { Pic as PicWork, Tag } from '@/components/WorkInterface'

type Props = {
  setSearchResultFunction: Function
}

export default function SearchField({setSearchResultFunction}: Props) {
  const [searchTerm, setSearchTerm] = useState<string>()
  // const [searchResults, setSearchResult] = useState<Work[]>([]);
  const [isInputSelected, setIsInputSelected] = useState<boolean>(false)
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {

    const handleButtonClick = () => {
      if (inputRef.current) {
        inputRef.current.focus();
        setIsInputSelected(true);
      }
    }

    const handleKeyDown = (event: any) => {
      if (event.key === '/') {
        event.preventDefault();
        handleButtonClick();
      }

      if (event.key === 'Escape') {
        deselectInput()
        // setSearchResult([])
      }
    }

    const deselectInput = () => {
      if (inputRef.current) {
        inputRef.current.blur()
        setIsInputSelected(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    // コンポーネントがアンマウントされたときにイベントリスナーを削除
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    };
  }, []);

  return (
    <div className={styles.field}>
      <input
        ref={inputRef}
        placeholder={"Press \"/\" to Search"}
        type={"text"}
        className={styles.input}
        onInput={(e: React.ChangeEvent<HTMLInputElement>)=>{setSearchResultFunction(e.target.value as string)}}
      />
      <button className={styles.button}>
        <FontAwesomeIcon icon={faMagnifyingGlass} className={styles.search_magnify} />
      </button>
    </div>
  )
}