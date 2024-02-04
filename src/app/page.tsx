import fs from 'fs'
import path from 'path'

import matter from 'gray-matter'

import PostList from '@/components/PostList'
import { serializeDatetime } from '@/utils/datetime'

const getStaticProps = async () => {
  // @ts-ignore
  async function getFiles(dir) {
    const dirents = await fs.promises.readdir(dir, { withFileTypes: true })
    // @ts-ignore
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

  const fileList = await getFiles(path.join('_posts'))
  const posts = fileList
    .filter((file: string) => !file.startsWith('_posts/pages'))
    .map((filename: string) => {
      const fileContent = fs.readFileSync(filename, 'utf-8')
      const slug = filename.replace('_posts/', '').split('.')[0]
      if (filename.endsWith('.md')) {
        throw new Error(`${filename} ends with .md is not allowed`)
      }

      const { data: frontMatter } = matter(fileContent)
      if (!frontMatter.title) {
        throw new Error('title is required')
      }
      frontMatter.createdAt = serializeDatetime(frontMatter.createdAt)
      frontMatter.updatedAt = serializeDatetime(frontMatter.updatedAt)
      return { frontMatter, slug: slug.replace(/\/index$/, '') }
    })
    .sort((a: any, b: any) => {
      const aUpdatedAt =
        a.frontMatter.updatedAt || a.frontMatter.createdAt || ''
      const bUpdatedAt =
        b.frontMatter.updatedAt || b.frontMatter.createdAt || ''
      if (aUpdatedAt === bUpdatedAt) {
        return 0
      }
      return aUpdatedAt > bUpdatedAt ? -1 : 1
    })

  return { slug: null, posts }
}

export default async function PostPage(): Promise<JSX.Element> {
  const { posts } = await getStaticProps()

  return (
    <div className="mb-8 flex flex-col items-center">
      <PostList posts={posts} />
    </div>
  )
}
