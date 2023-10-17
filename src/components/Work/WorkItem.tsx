'use client'

import styles from '@/styles/components/WorkItem.module.scss'
import React, { useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';

interface Tag {
  name: string
}

interface Work {
  name: string,
  author: string,
  description: string,
  thumbnail: string,
  guid: string,
  tags: Tag[]
}

export default function WorkList(props: Work) {
  return (
    <div>
      <div className={styles.checkbox}></div>
      <div className={styles.eye}></div>
      <div className={styles.id_box}></div>
      <div className={styles.title}></div>
      <div className={styles.author}></div>
      <div className={styles.modify}></div>
      <div className={styles.delete}></div>
    </div>
  )
}