import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@radix-ui/react-hover-card'
import {
  IconBooks,
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandTelegram,
  IconBriefcase,
  IconHeartHandshake,
  IconHome,
  IconUserCircle,
} from '@tabler/icons-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const itemMotion = {
  visible: { opacity: 1, x: 0 },
  hidden: { opacity: 0, x: 100 },
}

const navs = [
  {
    path: '/',
    name: 'Home',
    Icon: IconHome,
  },
  { path: '/bio/', name: 'Bio', Icon: IconUserCircle },
  { path: '/pages/', name: 'Pages', Icon: IconBooks },
  {
    path: '/pages/friend-links/',
    name: '友情链接',
    Icon: IconHeartHandshake,
  },
  {
    path: '/work-experience/',
    name: 'Work Exp',
    Icon: IconBriefcase,
  },
]
const links = [
  {
    path: 'https://github.com/kxxoling',
    name: '@kxxoling',
    Icon: IconBrandGithub,
  },
  {
    path: 'https://www.linkedin.com/in/kxxoling/',
    name: '@kxxoling',
    Icon: IconBrandLinkedin,
  },
]

const NavItem: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <li className="relative mx-2 cursor-pointer rounded-md px-4 py-1.5 font-extralight hover:bg-[#00000030] hover:text-white">
      {children}
    </li>
  )
}

function Tg() {
  return (
    <>
      <HoverCard>
        <HoverCardTrigger asChild>
          <div className="inline-block gap-2 rounded-[50%] border-2 p-1 text-white opacity-50 transition-all duration-300  hover:rounded-lg hover:opacity-100">
            <IconBrandTelegram size={20} />
          </div>
        </HoverCardTrigger>
        <HoverCardContent
          className=" flex flex-col gap-1 rounded bg-black/40 p-2"
          side="top"
          sideOffset={8}
        >
          <Link
            href="https://t.me/san_wei"
            target="_blank"
            className=" rounded px-2 py-1 hover:bg-black/20"
          >
            🐱 三味
          </Link>

          <Link
            href="https://t.me/AI_Vortex"
            target="_blank"
            className=" rounded px-2 py-1 hover:bg-black/20"
          >
            🤖 AI Vortex
          </Link>
        </HoverCardContent>
      </HoverCard>
    </>
  )
}

export default function Aside(): JSX.Element {
  const pathname = usePathname()
  return (
    <div className="flex h-full w-full shrink-0 flex-col overflow-hidden px-4 py-4">
      <div
        className={`
  cursor-pointer
  px-4
  text-3xl
  font-bold
  text-white
  transition-all
  hover:text-[#ff7551]
  max-md:py-6
  max-md:text-center`}
      >
        Blog
      </div>

      <hr className="mt-8 border-2 border-black opacity-20" />

      <div className="flex-1 overflow-y-auto overflow-x-hidden pb-4 pt-8">
        <div className="w-full">
          <ul className="flex flex-col">
            {navs.map(({ path, name, Icon }) => (
              <NavItem key={path}>
                <Link href={path}>
                  <motion.span
                    variants={itemMotion}
                    className="flex items-center gap-2 text-lg text-gray-100 max-md:py-2 max-md:text-2xl"
                  >
                    <span className="">
                      <Icon size={20} />
                    </span>
                    <span className="">{name}</span>
                  </motion.span>
                </Link>
                {pathname === path && (
                  <motion.div
                    layoutId="active-nav-link"
                    className="absolute inset-0 rounded-md bg-[#00000030]"
                  />
                )}
              </NavItem>
            ))}
          </ul>
        </div>

        <hr className="my-8 border-2 border-black opacity-20" />

        <div className="mt-1 w-full">
          <div className="px-2 text-sm text-gray-400">Links</div>
          <ul className="mt-4 flex gap-3 px-5">
            {links.map(({ path, Icon }) => (
              <li className="" key={path}>
                <Link
                  href={path}
                  className="inline-block gap-2 rounded-[50%] border-2 p-1 text-white opacity-50 transition-all duration-300 hover:rounded-lg hover:opacity-100"
                  target="_blank"
                >
                  <Icon size={20} />
                </Link>
              </li>
            ))}

            <li>
              <Tg />
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
