import path from 'path'

import PostList from '@/components/PostList'
import { getFileMetadata, getFiles, sortPosts } from '@/utils/post'

const getStaticProps = async () => {
  const fileList = await getFiles(path.join('_posts'))
  const posts = fileList.map(getFileMetadata('_posts')).sort(sortPosts)

  return { slug: null, posts }
}

export default async function PostPage(): Promise<JSX.Element> {
  const { posts } = await getStaticProps()

  return (
    <div className="mb-8 flex flex-col items-center">
      <PostList posts={posts} />
    </div>
  )
}
