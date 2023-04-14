import Badge from './Badge'

/* eslint-disable @next/next/no-img-element */
interface PostProps {
  title: string
  description?: string
  thumbnail?: string
  updatedAt?: string
  createdAt?: string
  tags?: string[]
}

const bgColors = ['#31abbd', 'rgb(255, 159, 104)']

function useRandomBgColor() {
  const random = bgColors[Math.floor(Math.random() * bgColors.length)]
  return random
}

function PostCard({
  title,
  description,
  updatedAt,
  createdAt,
  thumbnail,
  tags,
}: PostProps): JSX.Element {
  const bgColor = useRandomBgColor()
  return (
    <>
      <div
        className="relative w-full gap-1 p-8 overflow-hidden rounded-3xl"
        style={{ backgroundColor: bgColor }}
      >
        <div className="absolute top-0 right-0 w-1/3 h-full overflow-hidden">
          <img
            className="absolute top-0 right-0 h-full blur-xs"
            src={thumbnail}
            alt=""
          />
        </div>
        <div className="w-2/3 pb-8 text-3xl text-white">
          {description || title}
        </div>
        <div className="flex items-center">
          <div className="relative shrink-0">
            <img
              className="w-12 h-12 p-1 rounded-full border-[1px] border-solid border-white"
              src="https://avatars.githubusercontent.com/u/1227139"
            />
          </div>
          <div className="ml-4 text-white">
            <div className="text-sm">{description ? title : ''}</div>
            <div className="flex items-center text-xs">
              <span>53K views</span>
              <span className="inline-block w-1 h-1 mx-2 bg-white rounded-full"></span>
              <span>2 weeks ago</span>
            </div>
            <div className="flex gap-2 mt-1 opacity-50 text-slate-700 dark:text-slate-54">
              {tags?.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
            <div className="text-sky-700 dark:text-sky-300">
              {updatedAt || createdAt}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default PostCard
