'use client'

import React, { useState, useEffect } from 'react'
// import works from "@/jsons/works.json"
import WorkCard from '@/components/Work/WorkCard'
import styles from '@/styles/app/works.module.scss'
import Work from '@/components/WorkInterface'
import { invoke } from '@tauri-apps/api/tauri'
import { jsonDirectoryPath, jsonFilePath } from '@/components/Global/constants'
import SearchField from '@/components/Widgets/SearchField'
import { event } from '@tauri-apps/api'

export default function WorksList() {

  const [worksJsonData, setWorksJsonData] = useState<Work[]>([])
  const [searchResults, setSearchResult] = useState<Work[]>(worksJsonData);
  const [isTagListOpened, setIsTagListOpened] = useState<boolean>(false)
  const [uniqueTags, setUniqueTags] = useState<string[]>([])
  const [uniqueYears, setUniqueYears] = useState<number[]>([])
  const [filterTags, setFilterTags] = useState<string[]>([])
  const [filterYears, setFilterYears] = useState<number[]>([])
  const [inputString, setInputString] = useState<string>("")

  useEffect(() => {
    const setup = async () => {
      try {
        const res = await invoke('get_user_document_directory')
        const worksPath = res as string + jsonDirectoryPath + jsonFilePath
        const jsonRes = await invoke('read_json_file', { filePath: worksPath })
        const worksData = jsonRes as Work[]
        setWorksJsonData(worksData)
        setSearchResult(worksData)
        setUniqueTags(Array.from(new Set(worksData.flatMap(item => item.tags.map(tag => tag.name)))))
        setUniqueYears(
          Array.from(
            new Set(
              worksData
                .flatMap(item => (typeof item === 'object' && item.year ? Number(item.year) : NaN))
                .filter(year => !isNaN(year))
            )
          )
        )

      } catch (error) {
        console.error("Error", error)
      }
    }

    setup()
  }, [])

  const filter = (tags: string[], years: number[], input: string) => {

    if (tags.length === 0 && years.length === 0 && input === "") {
      setSearchResult(worksJsonData)

    } else {
      const resultForTags =
        worksJsonData.filter(item => {
          return item.tags.some(tag => tags.includes(tag.name))
        })

      const resultForYears =
        worksJsonData.filter(item => {
          return years.includes(item.year)
        })

      let resultForInput: Work[] = worksJsonData.filter(item => item.name.toLowerCase().includes(input.toLowerCase()))

      const resultArray: Work[] = []

      for (const item of resultForTags) {
        if (!resultArray.includes(item)) {
          resultArray.push(item)
        }
      }

      for (const item of resultForYears) {
        if (!resultArray.includes(item)) {
          resultArray.push(item)
        }
      }

      if ((tags.length > 0 || years.length > 0) && input !== "") {
        const res = resultArray.filter(item => resultForInput.includes(item))
        setSearchResult(res)
      } else if ((tags.length > 0 || years.length > 0) && input === "") {
        setSearchResult(resultArray)
      } else {
        setSearchResult(resultForInput)
      }
    }

  }

  const UpdateTagSorting = (event: any) => {
    let updatedArrays: string[] = []
    if (event.target.checked) {
      updatedArrays = [...filterTags, event.target.value]
    } else {
      updatedArrays = filterTags.filter(filterTag => filterTag !== event.target.value)
    }
    setFilterTags(updatedArrays)
    filter(updatedArrays, filterYears, inputString)
  }

  const UpdateYearSorting = (event: any) => {
    let updatedArrays: number[] = []
    if (event.target.checked) {
      updatedArrays = [...filterYears, event.target.value]
    } else {
      updatedArrays = filterYears.filter(filterYear => filterYear !== event.target.value)
    }
    setFilterYears(updatedArrays)
    filter(filterTags, updatedArrays, inputString)
  }

  const SetInputResult = (input: string) => {
    setInputString(input)
    filter(filterTags, filterYears, input)
    // setSearchResult(worksJsonData.filter(item => item.name.toLowerCase().includes(input)))

  }

  console.log(uniqueYears)

  const resultReduce = searchResults.filter((item) => item.visible)

  return (
    <>
      <h1 className={styles.title}>作品一覧</h1>
      <div className={styles.tab}>
        <button onClick={() => setIsTagListOpened(!isTagListOpened)} className={styles.tag_sort}>#タグ検索</button>
        <div className={`${isTagListOpened ? styles.open : ""} ${styles.tag_list}`}>
          {
            uniqueTags.map((item, i) => (
              <div key={i} className={styles.tag_div}>
                <label htmlFor={"sortTags" + item} key={i}>
                  <input
                    type="checkbox"
                    onChange={UpdateTagSorting}
                    value={item}
                    id={"sortTags" + item}
                    className={styles.check}
                  />
                  <span className={styles.check_string}>{item}</span>
                </label>
              </div>
            ))
          }
          <div className={styles.border} />
          {
            uniqueYears.map((item, i) => (
              <div key={i} className={styles.tag_div}>
                <label htmlFor={"sortYears" + item} key={i}>
                  <input
                    type="checkbox"
                    onChange={UpdateYearSorting}
                    value={item}
                    id={"sortYears" + item}
                    className={styles.check}
                  />
                  <span className={styles.check_string}>{item ? item : "未設定"}</span>
                </label>
              </div>
            ))
          }
        </div>
        <SearchField setSearchResultFunction={SetInputResult} />
      </div>
      <div className={styles.works}>
        {resultReduce.map((e, i) => {
          return (
            <li key={i}><WorkCard key={i} workData={e} /></li>
          )
        })}
      </div>
    </>
  )

}