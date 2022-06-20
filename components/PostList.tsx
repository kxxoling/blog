import Image from 'next/image'
import Link from 'next/link'

type Post = {
  frontMatter: Record<string, string>
  slug: string
}

function Post({ post }: { post: Post }): JSX.Element {
  const {
    frontMatter: { title, description, date, thumbnailUrl },
  } = post

  if (!thumbnailUrl) {
    return (
      <div
        className={`px-4 py-2
        text-2xl


        `}
      >
        {title}
      </div>
    )
  }

  return (
    <div className="card">
      <div className="row g-0">
        <div className="col-md-8">
          <div className="card-body">
            <h5 className="card-title">{title}</h5>
            {description && <p className="card-text">{description}</p>}
            {date && (
              <p className="card-text">
                <small className="text-muted">{date}</small>
              </p>
            )}
          </div>
        </div>

        <div className="m-auto col-md-4">
          <Image
            src={thumbnailUrl}
            className="img-fluid rounded-start"
            alt="thumbnail"
            width={500}
            height={400}
            objectFit="cover"
          />
        </div>
      </div>
    </div>
  )
}

export default function PostList({ posts }: { posts: Post[] }): JSX.Element {
  return (
    <>
      {posts.map((post) => (
        <Link href={`/${post.slug}`} key={post.slug}>
          <a
            className={`py-4 no-underline underline-offset-4 hover:underline decoration-slate-500 text-blue-700`}
          >
            <Post post={post} />
          </a>
        </Link>
      ))}
    </>
  )
}
