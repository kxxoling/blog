import { IconBriefcase } from '@tabler/icons-react'

interface Work {
  company: string
  description: string
  title: string
  startAt: string
  endAt: string
}
const works: Work[] = JSON.parse(process.env.NEXT_PUBLIC_WORK_EXP || '')

export default function WorkExperience() {
  return (
    <div className="p-8">
      <ol className="relative border-l border-gray-200 dark:border-gray-700">
        {works.map(({ company, description, title, startAt, endAt }) => (
          <li className="px-10 my-10" key={`${company}-${title}`}>
            <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
              <IconBriefcase size={20} className="p-1 text-gray-300" />
            </span>
            <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">
              <span>{title}</span>
              <span className="px-1 px-2 font-serif text-sm text-gray-400">
                @
              </span>
              <span className="text-sm text-gray-400 font-italic">
                {company}
              </span>
            </h3>
            <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
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
