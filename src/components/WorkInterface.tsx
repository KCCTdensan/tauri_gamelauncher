export interface Tag {
  name: string
}

export interface Pic {
  path: string
}

export default interface Work {
  name: string,
  author: string,
  description: string,
  thumbnail: string,
  targetFile: string,
  guid: string,
  url: string,
  pics: Pic[],
  tags: Tag[],
  year: number,
  visible: boolean
}
