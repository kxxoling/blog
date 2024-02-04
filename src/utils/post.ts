import fs from 'fs'
import path from 'path'

import matter from 'gray-matter'

import { serializeDatetime } from '@/utils/datetime'

export type FrontMatter = {
  title: string
  createdAt: `${number}-${number}-${number}`
  updatedAt?: `${number}-${number}-${number}`
  description?: string
  thumbnail?: string
  tags?: string[]
}
export type Metadata = {
  frontMatter: any
  slug: string
}

export const sortPosts = (a: Metadata, b: Metadata) => {
  const aUpdatedAt = a.frontMatter.updatedAt || a.frontMatter.createdAt || ''
  const bUpdatedAt = b.frontMatter.updatedAt || b.frontMatter.createdAt || ''
  if (aUpdatedAt === bUpdatedAt) {
    return 0
  }
  return aUpdatedAt > bUpdatedAt ? -1 : 1
}

export const getFiles = async (dir: string): Promise<string[]> => {
  const dirents = await fs.promises.readdir(dir, { withFileTypes: true })
  const files = await Promise.all(
    dirents
      .filter((dirent) => !dirent.name.startsWith('.'))
      .map((dirent) => {
        return dirent.isDirectory()
          ? getFiles(path.join(dir, dirent.name))
          : path.join(dir, dirent.name)
      })
  )
  return Array.prototype.concat(...files)
}

export const getFileMetadata = (dirPrefix: string) => (filename: string) => {
  const fileContent = fs.readFileSync(filename, 'utf-8')
  const slug = filename.replace(dirPrefix, '').split('.')[0]
  if (filename.endsWith('.md')) {
    throw new Error(`${filename} ends with .md is not allowed`)
  }

  const { data: frontMatter } = matter(fileContent)
  if (!frontMatter.title) {
    throw new Error('title is required')
  }
  frontMatter.createdAt = serializeDatetime(frontMatter.createdAt)
  frontMatter.updatedAt = serializeDatetime(frontMatter.updatedAt)
  return { frontMatter, slug: slug.replace(/\/index$/, '') } satisfies Metadata
}
