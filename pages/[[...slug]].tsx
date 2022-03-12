import type { GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import type { ParsedUrlQuery } from 'querystring'

import fs from 'fs'
import path from 'path'

import matter from 'gray-matter'
import { MDXRemote } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'

import instinctComponents from '../components/InstinctComponents'
import SyntaxHighlighter from '../components/SyntaxHighlighter'

// @ts-ignore
export const getStaticPaths = async () => {
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

  // @ts-ignore
  const paths = files.map((filename) => ({
    params: {
      slug: filename
        .replace('.mdx', '')
        .replace('.md', '')
        .replace('posts/', '')
        .split('/'),
    },
  }))

  return {
    paths,
    fallback: false,
  }
}

interface Params extends ParsedUrlQuery {
  slug: string[]
}

export const getStaticProps = async ({
  params,
}: GetStaticPropsContext<Params>) => {
  const slug = params!.slug
  const mdxPath = path.join('posts', slug.join('/') + '.mdx')
  const mdPath = path.join('posts', slug.join('/') + '.md')
  const filePath = fs.existsSync(mdxPath) ? mdxPath : mdPath
  const markdownWithMeta = fs.readFileSync(filePath, 'utf-8')

  const { data: frontMatter, content } = matter(markdownWithMeta)
  const mdxSource = await serialize(content)
  return {
    props: {
      frontMatter,
      slug,
      mdxSource,
    },
  }
}

export default function PostPage({
  frontMatter: { title },
  mdxSource,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const components = { ...instinctComponents, pre: SyntaxHighlighter }
  return (
    <div className="">
      {title && <h1>{title}</h1>}
      {/* @ts-ignore */}
      <MDXRemote {...mdxSource} components={components} />
    </div>
  )
}
