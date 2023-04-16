import Link from 'next/link'

import PostCard from '../components/PostCard'

type Post = {
  frontMatter: {
    title: string
    updatedAt: string
    createdAt: string
    description?: string
    thumbnail?: string
    tags?: string[]
  }
  slug: string
}

function Post({ post }: { post: Post }): JSX.Element | null {
  const {
    frontMatter: { title, description, updatedAt, createdAt, thumbnail, tags },
  } = post

  return (
    <PostCard
      title={title}
      description={description}
      tags={tags}
      thumbnail={thumbnail}
      updatedAt={updatedAt}
      createdAt={createdAt}
    />
  )
}

export default function PostList({ posts }: { posts: Post[] }): JSX.Element {
  return (
    <>
      {posts.map((post) => (
        <Link
          href={`/${post.slug}`}
          key={post.slug}
          className="flex w-full py-4 no-underline cursor-pointer grow"
        >
          <Post post={post} />
        </Link>
      ))}
    </>
  )
}
