"use client";

import works from "@/jsons/works.json"
import * as React from 'react'
import styles from '@/styles/app/detail.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'

interface Tag {
  name: string
}

export default class Work extends React.Component {
  guid: string
  name: string
  author: string
  description: string
  tags: Tag[]

  constructor(props: any) {
    super(props)

    this.guid = "null"
    this.name = "null"
    this.author = "null"
    this.description = "null"
    this.tags = []

    this.state = {
      found: false
    }
  }

  componentDidMount() {
    const searchParams = new URLSearchParams(window.location.search)
    const id = searchParams.get('id')

    if (id) {
      const matchedObject = works.find(item => item.guid === id);

      if (matchedObject) {
        this.guid = matchedObject.guid
        this.name = matchedObject.name
        this.author = matchedObject.author
        this.description = matchedObject.description
        this.tags = matchedObject.tags

        this.setState({
          found: true
        })
      }
    }
  }

  render(): React.ReactNode {

    return (
      <>
        <h1 className={styles.title}>{this.name}</h1>
        <div className={styles.field}>
          <div className={styles.thumbnail}>
            thumbnail
          </div>
          <div className={styles.author}>
            <FontAwesomeIcon icon={faUser} className={styles.icon} />{this.author}
          </div>
          <div className={styles.click}><p>Launch</p></div>
          <div className={styles.description}>
            {this.description}
          </div>
        </div>
      </>
    )
  }
}