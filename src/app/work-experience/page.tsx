import { IconBriefcase } from '@tabler/icons-react'

interface Work {
  company: string
  description: string
  title: string
  startAt: string
  endAt: string
}
const works = JSON.parse(process.env.NEXT_PUBLIC_WORK_EXP || '') as Work[]

export default function WorkExperience() {
  return (
    <div className="p-8">
      <ol className="relative border-l border-gray-200 dark:border-gray-700">
        {works.map(({ company, description, title, startAt, endAt }) => (
          <li className="my-10 px-10" key={`${company}-${title}`}>
            <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 ring-8 ring-white dark:bg-blue-900 dark:ring-gray-900">
              <IconBriefcase size={20} className="p-1 text-gray-300" />
            </span>
            <h3 className="mb-1 flex items-center text-lg font-semibold text-gray-900 dark:text-white">
              <span>{title}</span>
              <span className="px-1 px-2 font-serif text-sm text-gray-400">
                @
              </span>
              <span className="font-italic text-sm text-gray-400">
                {company}
              </span>
            </h3>
            <time className="mb-2 block text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
              {startAt} - {endAt}
            </time>
            <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
              {description}
            </p>
          </li>
        ))}
      </ol>
    </div>
  )
}
