import fs from 'fs'
import path from 'path'

import { Feed } from 'feed'
import matter from 'gray-matter'

function serializeDatetime(datetime: string | Date) {
  if (!datetime) {
    return null
  }
  if (datetime) {
    if (typeof datetime === 'string') {
      return new Date(datetime).toISOString()
    } else if (datetime instanceof Date) {
      return datetime.toISOString()
    }
  }
}

export async function getSortedPosts() {
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
  const posts = fileList
    .filter((file: string) => !file.startsWith('posts/pages'))
    .map((filename: string) => {
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
        return {
          frontMatter: {
            title: fileContent.split('\n')[0].replace('#', '').trim(),
          },
          slug: slug.replace(/\/(README|index)$/, ''),
        }
      }

      const { data: frontMatter } = matter(fileContent)
      if (!frontMatter.title) {
        // 对于直接修改后缀名没有设置 title 的文章，默认使用首行大标题作为 title
        frontMatter.title = fileContent.split('\n')[0].replace('#', '').trim()
      }
      frontMatter.createdAt = serializeDatetime(frontMatter.createdAt)
      frontMatter.updatedAt = serializeDatetime(frontMatter.updatedAt)
      return { frontMatter, slug: slug.replace(/\/(README|index)$/, '') }
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

  return posts
}

export async function generateRssFeed(posts: any[]) {
  const BASE_URL = 'https://blog.windrunner.me'

  const feedOptions = {
    title: "kxxoling's Blog | 山人呓语",
    description: '山人多呓语，浮世笑百姿',
    id: BASE_URL,
    link: BASE_URL,
    image: `${BASE_URL}/logo.png`,
    favicon: `${BASE_URL}/logo.png`,
    copyright: 'CC 4.0 BY-NC-SA',
    generator: 'Feed for Node.js',
    updated: new Date(),
    feedLinks: {
      rss2: `${BASE_URL}/rss.xml`,
      json: `${BASE_URL}/rss.json`,
      atom: `${BASE_URL}/atom.xml`,
    },
  }

  const feed = new Feed(feedOptions)

  posts.forEach((post) => {
    feed.addItem({
      title: post.frontMatter.title,
      id: post.slug,
      link: `${BASE_URL}/${post.slug}`,
      description: post.frontMatter.description,
      date: post.updatedAt || post.createdAt || new Date(),
    })
  })
  fs.writeFileSync('./public/rss.xml', feed.rss2())
  fs.writeFileSync('./public/atom.xml', feed.atom1())
  fs.writeFileSync('./public/feed.xml', feed.atom1())
}
