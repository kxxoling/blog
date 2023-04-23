import Badge from './Badge'

/* eslint-disable @next/next/no-img-element */
interface PostProps {
  title: string
  description?: string
  thumbnail?: string
  updatedAt?: `${number}-${number}-${number}`
  createdAt?: `${number}-${number}-${number}`
  tags?: string[]
}

const bgColors = [
  '#31abbd',
  'rgb(255, 159, 104)',
  'rgb(61 239 233)',
  'rgb(107 217 104)',
  'rgb(254 204 27)',
  'rgb(102 102 102)',
  'rgb(206 59 90)',
  'rgb(89 176 255)',
  'rgb(216 59 210)',
  'rgb(57 146 255)',
  'rgb(244 66 80)',
]

function hashBgColor(str: string) {
  // get hash number from str
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash += str.charCodeAt(i)
  }
  const bgColor = bgColors[hash % bgColors.length]

  return bgColor
}

function formatDate(date: Date) {
  return date.toLocaleDateString('zh-CN', {})
}

function formatFrontMatterDate(str: `${number}-${number}-${number}`) {
  return formatDate(new Date(str))
}

function PostCard({
  title,
  description,
  updatedAt,
  createdAt,
  thumbnail,
  tags,
}: PostProps): JSX.Element {
  const bgColor = hashBgColor(title)

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
              alt=""
            />
          </div>
          <div className="flex flex-col gap-1 ml-4 text-white">
            <div className="text-sm">{description ? title : ''}</div>

            <div className="flex gap-2 mt-1 opacity-50 text-slate-700 dark:text-slate-54">
              {tags?.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>

            <div className="flex items-center text-xs">
              {updatedAt && (
                <span>编辑于：{formatFrontMatterDate(updatedAt)}</span>
              )}
              {updatedAt && createdAt && (
                <span className="inline-block w-1 h-1 mx-2 bg-white rounded-full"></span>
              )}
              {createdAt && (
                <span>创建于：{formatFrontMatterDate(createdAt)}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default PostCard
