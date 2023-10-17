'use client'

import * as React from 'react'
import works from "@/jsons/works.json"
import Link from 'next/link'
import styles from '@/styles/components/WorkCard.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'

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

export default class WorkCard extends React.Component<WorkCardProps> {
  constructor(props: WorkCardProps) {
    super(props)
  }

  render(): React.ReactNode {
    // console.log(works)
    const { guid, name, author, description, tags } = this.props.workData;
    return (
      <div>
        <Link href={"/works/d?id=" + guid} className={styles.link}>
          <div className={styles.card}>
            <div className={styles.author}><FontAwesomeIcon icon={faUser} className={styles.icon} />{author}</div>
            <div className={styles.click}>Quick Launch</div> {/* この要素にclient要素をclick時に動作 */}
            <div className={styles.thumbnail}>{/* サムネイル */}</div>
            <div className={styles.title}>{name}</div>
            <div className={styles.description}>{description}</div>
            <div>
              <ul className={styles.tags}>
                {tags.map((e, i) => (
                  <li key={i} className={styles.tag}>{e.name}</li>
                ))}
              </ul>
            </div>
          </div>
        </Link>
      </div>
    )
  }
}