'use client'
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion'

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
  'rgba(49, 171, 189, 0.4)',
  'rgba(255, 159, 104, 0.4)',
  'rgba(61, 239, 233, 0.4)',
  'rgba(107, 217, 104, 0.4)',
  'rgba(254, 204, 27, 0.4)',
  'rgba(102, 102, 102, 0.4)',
  'rgba(206, 59, 90, 0.4)',
  'rgba(89, 176, 255, 0.4)',
  'rgba(216, 59, 210, 0.4)',
  'rgba(57, 146, 255, 0.4)',
  'rgba(244, 66, 80, 0.4)',
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
  return (
    <>
      <div className="relative w-full gap-1 overflow-hidden rounded-3xl p-8">
        <div className="absolute right-0 top-0 h-full w-1/3 overflow-hidden">
          <img
            className="blur-xs absolute right-0 top-0 h-full"
            src={thumbnail}
            alt=""
          />
        </div>
        {description && (
          <div className="w-2/3 pb-8 text-3xl text-white">{title}</div>
        )}
        <div className="flex items-center">
          <div className="relative shrink-0">
            <img
              className="h-12 w-12 rounded-full border-[1px] border-solid border-white p-1"
              src="https://avatars.githubusercontent.com/u/1227139"
              alt=""
            />
          </div>
          <div className="ml-4 flex flex-col gap-1 text-white">
            <div className="text-sm">{description || title}</div>

            <div className="dark:text-slate-54 mt-1 flex gap-2 text-slate-700 opacity-50">
              {tags?.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>

            <div className="flex items-center text-xs">
              {updatedAt && (
                <span>编辑于：{formatFrontMatterDate(updatedAt)}</span>
              )}
              {updatedAt && createdAt && (
                <span className="mx-2 inline-block h-1 w-1 rounded-full bg-white"></span>
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

const MotionPostCard: React.FC<PostProps> = (props) => {
  const bgColor = hashBgColor(props.title)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: React.MouseEvent<HTMLDivElement>) {
    if (!currentTarget) {
      return
    }
    const { left, top } = currentTarget.getBoundingClientRect()

    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      className="max-w-md group relative w-full rounded-xl border border-white/10 shadow-2xl"
      style={{ backgroundColor: bgColor }}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              ${bgColor},
              transparent 100%
            )
          `,
        }}
      />
      <PostCard {...props} />
    </div>
  )
}

export default MotionPostCard
