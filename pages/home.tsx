import type { InferGetStaticPropsType } from 'next'

import fs from 'fs'
import path from 'path'

import matter from 'gray-matter'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

export const getStaticProps = async () => {
  // @ts-ignore
  async function getFiles(dir) {
    const dirents = await fs.promises.readdir(dir, { withFileTypes: true })
    // @ts-ignore
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

  const fileList = await getFiles(path.join('posts'))
  const posts = fileList.map((filename: string) => {
    const mdWithMeta = fs.readFileSync(
      filename, // 'posts/xxx.{md|mdx}
      'utf-8'
    )
    const { data: frontMatter } = matter(mdWithMeta)
    return {
      frontMatter,
      slug: filename.replace('posts/', '').split('.')[0],
    }
  })
  return {
    props: { posts },
  }
}

export default function Home({
  posts,
}: InferGetStaticPropsType<typeof getStaticProps>): JSX.Element {
  return (
    <div className="">
      <Head>
        <title>home</title>
      </Head>
      {/* @ts-ignore */}
      {posts.map((post, index) => (
        <Link href={`/${post.slug}`} passHref key={index}>
          <div className="card mb-3 pointer" style={{ maxWidth: '540px' }}>
            <div className="row g-0">
              <div className="col-md-8">
                <div className="card-body">
                  <h5 className="card-title">
                    {post.frontMatter.title} {post.slug}
                  </h5>
                  <p className="card-text">{post.frontMatter.description}</p>
                  <p className="card-text">
                    <small className="text-muted">
                      {post.frontMatter.date}
                    </small>
                  </p>
                </div>
              </div>
              <div className="col-md-4 m-auto">
                {post.frontMatter.thumbnailUrl && (
                  <Image
                    src={post.frontMatter.thumbnailUrl}
                    className="img-fluid mt-1 rounded-start"
                    alt="thumbnail"
                    width={500}
                    height={400}
                    objectFit="cover"
                  />
                )}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
