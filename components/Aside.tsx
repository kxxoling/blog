import {
  IconBooks,
  IconBrandGithub,
  IconBrandLinkedin,
  IconBriefcase,
  IconHeartHandshake,
  IconHome,
  IconUserCircle,
} from '@tabler/icons-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styled from 'styled-components'
import tw from 'twin.macro'

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

const NavItem = styled.li`
  ${tw`px-4 py-1.5 mx-2 rounded-md cursor-pointer font-extralight relative`}

  &:hover {
    ${tw`bg-[#00000030]`}
    & span:first-child {
      ${tw`text-white border-white`}
    }
    & span {
      ${tw`text-white`}
    }
  }
`

export default function Aside(): JSX.Element {
  const pathname = usePathname()
  return (
    <div className="flex flex-col w-full h-full px-4 py-4 overflow-hidden shrink-0">
      <div
        className={`
  text-white
  text-3xl
  font-bold
  cursor-pointer
  px-4
  max-md:text-center
  max-md:py-6
  hover:text-[#ff7551]
  transition-all`}
      >
        Blog
      </div>

      <hr className="mt-8 border-2 border-black opacity-20" />

      <div className="flex-1 pt-8 pb-4 overflow-x-hidden overflow-y-auto">
        <div className="w-full">
          <ul className="flex flex-col">
            {navs.map(({ path, name, Icon }) => (
              <NavItem key={path}>
                <Link href={path}>
                  <motion.span
                    variants={itemMotion}
                    className="flex items-center gap-2 text-lg text-gray-100 max-md:text-2xl max-md:py-2"
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
                    className="absolute inset-0 bg-[#00000030] rounded-md"
                  />
                )}
              </NavItem>
            ))}
          </ul>
        </div>

        <hr className="my-8 border-2 border-black opacity-20" />

        <div className="w-full mt-1">
          <div className="px-2 text-sm text-gray-400">Links</div>
          <ul className="flex gap-3 px-5 mt-4">
            {links.map(({ path, Icon }) => (
              <li className="" key={path}>
                <Link
                  href={path}
                  className="inline-block gap-2 p-1 text-white transition-all duration-300 border-2 rounded-[50%] opacity-50 hover:opacity-100 hover:rounded-lg"
                  target="_blank"
                >
                  <Icon size={20} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
