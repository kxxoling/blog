import fs from 'fs'
import path from 'path'

import matter from 'gray-matter'
import Head from 'next/head'

import PostList from '@/components/PostList'
import { serializeDatetime } from '@/utils/datetime'

const getStaticProps = async () => {
  // Copied from pages/[[...slug]].tsx
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

  const fileList = await getFiles(path.join('posts/pages'))
  const pagePosts = fileList.map((filename: string) => {
    const fileContent = fs.readFileSync(filename, 'utf-8') // posts/pages/xxx.mdx
    const slug = filename.replace('posts', '').split('.')[0]

    const { data: frontMatter } = matter(fileContent)
    if (!frontMatter.title) {
      throw new Error('title is required')
    }
    frontMatter.createdAt = serializeDatetime(frontMatter.createdAt)
    frontMatter.updatedAt = serializeDatetime(frontMatter.updatedAt)
    return { frontMatter, slug }
  })

  return { posts: pagePosts }
}

export default async function Pages() {
  const { posts } = await getStaticProps()
  return (
    <div className="">
      <Head>
        <title>home</title>
      </Head>
      {<PostList posts={posts} />}
    </div>
  )
}
