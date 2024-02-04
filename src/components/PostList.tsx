import type { Metadata } from '@/utils/post'

import Link from 'next/link'

import PostCard from '@/components/PostCard'

function Post({ post }: { post: Metadata }): JSX.Element | null {
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

export default function PostList({
  posts,
}: {
  posts: Metadata[]
}): JSX.Element {
  return (
    <div className="px-8">
      {posts.map((post) => (
        <Link
          href={`${post.slug}`}
          key={post.slug}
          className="flex w-full grow cursor-pointer py-4 no-underline"
        >
          <Post post={post} />
        </Link>
      ))}
    </div>
  )
}
