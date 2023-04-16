import {
  IconBooks,
  IconBrandGithub,
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
  p-8
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
  mb-3

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
]

const NavItem = styled.li`
  ${tw`px-2 py-2 rounded-md cursor-pointer`}

  & span {
    ${tw`text-gray-400 transition-all border-gray-400 rounded-md `}
  }

  &:hover {
    ${tw`bg-[#ff7551]`}
    & span:first-child {
      ${tw`text-white border-white `}
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
                className="flex items-center gap-4 text-lg text-gray-300 "
              >
                <span className="p-2 rounded-md border-[1px] border-solid">
                  <Icon size={14} />
                </span>
                <span>{name}</span>
              </Link>
            </NavItem>
          ))}
        </ul>
      </div>

      <hr className="mt-8 mb-8 border-gray-700" />

      <div className="w-full mt-1">
        <div className="text-gray-400 text-s">Links</div>
        <ul className="flex flex-col mt-4">
          {links.map(({ path, name, Icon }) => (
            <li className="px-2" key={path}>
              <Link
                href={path}
                className="flex items-center gap-4 my-2 text-gray-400 text-md"
              >
                <span className="p-2 border-[1px] border-gray-500 border-solid rounded-md">
                  <Icon size={16} />
                </span>
                <span>{name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Sidebar>
  )
}
