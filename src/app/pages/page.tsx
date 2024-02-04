import path from 'path'

import Head from 'next/head'

import PostList from '@/components/PostList'
import { getFileMetadata, getFiles } from '@/utils/post'

const getStaticProps = async () => {
  const fileList = await getFiles(path.join('_pages'))
  const pagePosts = fileList.map(getFileMetadata('_pages'))

  return { posts: pagePosts }
}

export default async function Pages() {
  const { posts } = await getStaticProps()
  return (
    <div className="">
      <Head>
        <title>home</title>
      </Head>
      <PostList
        posts={posts.map((post) => {
          return {
            ...post,
            slug: `/pages${post.slug}`,
          }
        })}
      />
    </div>
  )
}
