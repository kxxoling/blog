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

const langs = shiki.BUNDLED_LANGUAGES.map((lang) => lang.id) as Lang[]

interface PageParams {
  slug: string[]
}

export async function generateStaticParams(): Promise<PageParams[]> {
  // @ts-ignore
  async function getFiles(dir): Promise<string[]> {
    const dirents = await fs.promises.readdir(dir, { withFileTypes: true })
    const files = await Promise.all(
      dirents
        .filter((dirent) => !dirent.name.startsWith('.'))
        .map((dirent) => {
          // const res = path.resolve(dir, dirent.name)
          return dirent.isDirectory()
            ? getFiles(path.join(dir, dirent.name))
            : path.join(dir, dirent.name)
        })
    )
    return Array.prototype.concat(...files)
  }

  const files = await getFiles(path.join('posts'))

  const paths = files.map((filename) => ({
    slug: filename
      .replace(/^posts\//, '')
      .replace(/\.mdx$/, '')
      .replace(/\/index$/, '')
      .split('/'),
  }))
  return paths
}

const getStaticProps = async (slug: string[]) => {
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
      const fileContent = fs.readFileSync(filename, 'utf-8') // 'posts/xxx.mdx'
      const slug = filename.replace('posts/', '').split('.')[0]
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

  let filePath = path.join('posts', slug.join('/') + '.mdx')
  if (!fs.existsSync(filePath)) {
    const mdxPath = path.join('posts', slug.join('/') + '/' + 'index.mdx')
    if (fs.existsSync(mdxPath)) {
      filePath = mdxPath
    } else {
      throw new Error(`File ${filePath} not found!`)
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
