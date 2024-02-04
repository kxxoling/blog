import type { Metadata } from './post'

import fs from 'fs'
import path from 'path'

import { Feed } from 'feed'

import { getFileMetadata, getFiles, sortPosts } from './post'

export async function getSortedPosts(): Promise<Metadata[]> {
  const fileList = await getFiles(path.join('_posts'))
  const posts = fileList.map(getFileMetadata('_posts')).sort(sortPosts)
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

  posts.forEach((post: Metadata) => {
    const date = new Date(
      post.frontMatter.updatedAt || post.frontMatter.createdAt
    )
    feed.addItem({
      title: post.frontMatter.title,
      id: post.slug,
      link: `${BASE_URL}/${post.slug}`,
      description: post.frontMatter.description,
      date,
    })
  })
  fs.writeFileSync('./public/rss.xml', feed.rss2())
  fs.writeFileSync('./public/atom.xml', feed.atom1())
  fs.writeFileSync('./public/feed.xml', feed.atom1())
}
