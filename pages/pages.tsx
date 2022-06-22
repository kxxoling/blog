import fs from 'fs'
import path from 'path'

import matter from 'gray-matter'
import Head from 'next/head'

import PostList from '../components/PostList'

export const getStaticProps = async () => {
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

  const fileList = await getFiles(path.join('posts'))
  const posts = fileList.map((filename: string) => {
    const fileContent = fs.readFileSync(
      filename, // 'posts/xxx.{md|mdx}
      'utf-8'
    )
    const slug = filename.replace('posts/', '').split('.')[0]
    if (filename.endsWith('.md')) {
      // 处理 markdown 文章
      if (filename.indexOf('README') < 0) {
        return {
          frontMatter: {
            title: fileContent.split('\n')[0].replace('#', '').trim(),
          },
          slug,
        }
      }
      // 处理 README 文档， TODO: 对 index.mdx 进行同样处理
      return {
        frontMatter: {
          title: fileContent.split('\n')[0].replace('#', '').trim(),
        },
        slug: slug.replace('/README', ''),
      }
    }
    const { data: frontMatter } = matter(fileContent)
    if (!frontMatter.title) {
      // 对于直接修改后缀名没有设置 title 的文章，默认使用首行大标题作为 title
      frontMatter.title = fileContent.split('\n')[0].replace('#', '').trim()
    }
    return { frontMatter, slug }
  })

  return { props: { posts } }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function Pages({ posts }: never) {
  // 这个页面是仅为了保持 SEO，不应该有人看到它
  return (
    <div className="">
      <Head>
        <title>home</title>
      </Head>
      {<PostList posts={posts} />}
    </div>
  )
}
