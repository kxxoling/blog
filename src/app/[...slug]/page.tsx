import type { Lang } from 'shiki'

import fs from 'fs'
import path from 'path'

import rehypeShiki from '@leafac/rehype-shiki'
import matter from 'gray-matter'
import { serialize } from 'next-mdx-remote/serialize'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeCodeTitles from 'rehype-code-titles'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import * as shiki from 'shiki'

import PostDetails from '@/components/PostDetails'
import { serializeDatetime } from '@/utils/datetime'
import { getFileMetadata, getFiles, sortPosts } from '@/utils/post'

const langs = shiki.BUNDLED_LANGUAGES.map((lang) => lang.id) as Lang[]

interface PageParams {
  slug: string[]
}

export async function generateStaticParams(): Promise<PageParams[]> {
  const postFiles = await getFiles(path.join('_posts'))

  const postPaths = postFiles.map((filename) => ({
    slug: filename
      .replace(/^_posts\//, '')
      .replace(/\.mdx$/, '')
      .replace(/\/index$/, '')
      .split('/'),
  }))
  const pageFiles = await getFiles(path.join('_pages'))
  const pagePaths = pageFiles.map((filename) => ({
    slug: filename
      .replace(/^_pages\//, 'pages/')
      .replace(/\.mdx$/, '')
      .replace(/\/index$/, '')
      .split('/'),
  }))

  return postPaths.concat(pagePaths)
}

const getStaticProps = async (slug: string[]) => {
  const fileList = await getFiles(path.join('_posts'))

  const posts = fileList.map(getFileMetadata('_posts')).sort(sortPosts)

  let filePath
  if (slug[0] === 'pages') {
    filePath = path.join('_pages', slug.slice(1).join('/') + '.mdx')
  } else {
    filePath = path.join('_posts', slug.join('/') + '.mdx')
    if (!fs.existsSync(filePath)) {
      const mdxPath = path.join('_posts', slug.join('/') + '/' + 'index.mdx')
      if (fs.existsSync(mdxPath)) {
        filePath = mdxPath
      }
    }
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8')

  const { data: frontMatter, content } = matter(fileContent)
  const mdxSource = await serialize(content, {
    mdxOptions: {
      rehypePlugins: [
        rehypeSlug,
        remarkGfm,
        [
          rehypeAutolinkHeadings,
          {
            properties: { className: ['anchor'] },
          },
          { behaviour: 'wrap' },
        ],

        [
          rehypeShiki,
          {
            highlighter: await shiki.getHighlighter({
              theme: 'poimandres',
              langs,
            }),
          },
        ],
        rehypeCodeTitles,
      ],
    },
  })
  frontMatter.createdAt = serializeDatetime(frontMatter.createdAt)
  frontMatter.updatedAt = serializeDatetime(frontMatter.updatedAt)
  return {
    frontMatter,
    slug,
    mdxSource,
    posts,
  }
}

export default async function PostPage({
  params: { slug },
}: {
  params: PageParams
}): Promise<JSX.Element> {
  const { frontMatter, mdxSource } = await getStaticProps(slug)

  return (
    <PostDetails frontMatter={frontMatter} mdxSource={mdxSource} slug={slug} />
  )
}
