import type { GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import type { ParsedUrlQuery } from 'querystring'

import fs from 'fs'
import path from 'path'

import matter from 'gray-matter'
import dockerfile from 'highlight.js/lib/languages/dockerfile'
import erlang from 'highlight.js/lib/languages/erlang'
import ini from 'highlight.js/lib/languages/ini'
import nginx from 'highlight.js/lib/languages/nginx'
import scheme from 'highlight.js/lib/languages/scheme'
import vim from 'highlight.js/lib/languages/vim'
import { serialize } from 'next-mdx-remote/serialize'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeCodeTitles from 'rehype-code-titles'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'

import PostDetails from '../components/PostDetails'
import PostList from '../components/PostList'

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
  const paths = files
    .map((filename) => ({
      params: {
        slug: filename
          .replace('.mdx', '')
          .replace('.md', '')
          .replace('posts/', '')
          .replace('/README', '')
          .split('/'),
      },
    }))
    .concat({ params: { slug: [''] } })
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

  if (!slug) {
    return { props: { slug: null, posts } }
  }
  let filePath = path.join('posts', slug.join('/') + '.mdx')
  if (!fs.existsSync(filePath)) {
    const mdPath = path.join('posts', slug.join('/') + '.md')
    if (fs.existsSync(mdPath)) {
      filePath = mdPath
    } else {
      const mdxReadmePath = path.join('posts', slug.join('/') + '/README.mdx')
      filePath = fs.existsSync(mdxReadmePath)
        ? mdxReadmePath
        : path.join('posts', slug.join('/') + '/README.md')
    }
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8')

  const { data: frontMatter, content } = matter(fileContent)
  const mdxSource = await serialize(content, {
    mdxOptions: {
      rehypePlugins: [
        rehypeSlug,
        [
          rehypeAutolinkHeadings,
          {
            properties: { className: ['anchor'] },
          },
          { behaviour: 'wrap' },
        ],

        [
          rehypeHighlight,
          {
            ignoreMissing: true, // 默认 false，但是 sequence 和 mermaid 需要稍后支持
            languages: {
              scheme,
              conf: ini,
              systemd: ini,
              nginx,
              dockerfile,
              vim,
              erlang,
            },
          },
        ],
        rehypeCodeTitles,
      ],
    },
  })
  return {
    props: {
      frontMatter,
      slug,
      mdxSource,
      posts,
    },
  }
}

// @ts-ignore
function Home({ posts }) {
  return (
    <div className="flex flex-col items-center mb-8">
      <PostList posts={posts} />
    </div>
  )
}

export default function PostPage({
  slug,
  posts,
  frontMatter,
  mdxSource,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  if (slug === null) {
    return <Home posts={posts} />
  }
  return (
    <PostDetails frontMatter={frontMatter} mdxSource={mdxSource} slug={slug} />
  )
}
