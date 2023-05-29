import {
  IconBooks,
  IconBrandGithub,
  IconBrandLinkedin,
  IconBriefcase,
  IconHeartHandshake,
  IconHome,
  IconUserCircle,
} from '@tabler/icons-react'
import 'highlight.js/styles/xcode.css'
import Link from 'next/link'
import styled from 'styled-components'
import tw from 'twin.macro'

const Sidebar = tw.nav`
  w-[240px]
  h-full
  py-4
  px-4
  rounded-md
  bg-[rgba(0,0,0,0.1)]

  flex flex-col shrink-0
  overflow-x-hidden overflow-y-auto
`

const LogoExpand = tw.div`
  text-white
  text-3xl
  font-bold
  cursor-pointer

  top-0
  sticky
  px-4

  hover:text-[#ff7551]
  transition-all
`

const navs = [
  {
    path: '/',
    name: 'Home',
    Icon: IconHome,
  },
  { path: '/bio', name: 'Bio', Icon: IconUserCircle },
  { path: '/pages', name: 'Pages', Icon: IconBooks },
  {
    path: '/pages/friend-links',
    name: '友情链接',
    Icon: IconHeartHandshake,
  },
  {
    path: '/work-experience',
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
  ${tw`px-4 py-1.5 mx-2 rounded-md cursor-pointer font-extralight`}

  & span {
    ${tw``}
  }

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
  return (
    <Sidebar>
      <LogoExpand>Blog</LogoExpand>

      <div className="w-full mt-1">
        <ul className="flex flex-col mt-4">
          {navs.map(({ path, name, Icon }) => (
            <NavItem key={path}>
              <Link
                href={path}
                className="flex items-center gap-2 text-lg text-gray-100 transition-all rounded-md"
              >
                <span className="">
                  <Icon size={20} />
                </span>
                <span className="">{name}</span>
              </Link>
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
    </Sidebar>
  )
}
