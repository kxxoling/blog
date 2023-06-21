/* eslint-disable @next/next/no-img-element */
'use client'

import { IconSearch } from '@tabler/icons-react'
import { Analytics } from '@vercel/analytics/react'
import { motion, useScroll } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useMedia } from 'react-use'
import styled, { css } from 'styled-components'
import tw from 'twin.macro'

import Aside from '@/components/Aside'
import useConfetti from '@/components/Confetti'

import '../styles/globals.css'

const Container = styled.div`
  ${tw`
  p-2
  bg-[rgba(16,18,27,.4)]
  max-w-[1360px]
  max-h-[1200px]
  h-[95vh]
  w-full
  max-md:h-screen

  h-screen
  flex
  rounded-lg
  relative
  shadow-lg
  overflow-hidden`}

  ${css`
    &::before {
      // backdrop blur will break view position, limit this into before element
      ${tw`backdrop-blur-lg`}
    }
  `}
`

const Background = styled.div`
  background-image: url('https://wallpapershome.com/images/wallpapers/macos-big-sur-1280x720-dark-wwdc-2020-22655.jpg');
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  background-blend-mode: color-dodge;

  ${tw`flex flex-col items-center justify-center max-md:p-0`}

  padding: 1em 2em;
  width: 100vw;
  height: 100vh;
  overflow: hidden;

  &:before {
    width: 100%;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    background: linear-gradient(
      163deg,
      rgba(31, 29, 43, 1) 21%,
      rgba(31, 29, 43, 0.3) 64%
    );
    opacity: 0.4;
    content: '';
  }
`

const Input = tw.input`
w-full h-full
bg-[#ffffff20] rounded-md
hover:bg-[#ffffff10]
active:bg-[#ffffff10]
text-sm text-white
px-6 py-2 shadow-sm
outline-none
hover:ring-2 ring-[#ff7551]
cursor-not-allowed
`

const navMotion = {
  visible: {
    opacity: 1,
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.1,
    },
  },
  hidden: {
    opacity: 0,
  },
}

export function PageLayout({
  children,
}: {
  children: React.ReactNode
}): JSX.Element {
  const [createConfetti, confetti] = useConfetti()
  const container = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({ container })
  const [toggled, setToggled] = useState(false)
  const matches = useMedia('(min-width: 768px)')
  const pathname = usePathname()
  useEffect(() => {
    setToggled(false)
  }, [pathname])

  return (
    <html lang="en">
      <body>
        <Background>
          <Container>
            {!matches && (
              <div
                onClick={() => {
                  setToggled((prev) => !prev)
                }}
                className="fixed z-50 space-y-1 cursor-pointer select-none top-10 left-4"
              >
                <motion.span
                  animate={{ rotateZ: toggled ? 45 : 0, y: toggled ? 8 : 0 }}
                  className="block h-0.5 w-8 bg-white"
                ></motion.span>
                <motion.span
                  animate={{ width: toggled ? 0 : 24 }}
                  className="block h-0.5 w-6 bg-white"
                ></motion.span>
                <motion.span
                  animate={{
                    rotateZ: toggled ? -45 : 0,
                    y: toggled ? -4 : 0,
                    width: toggled ? 32 : 16,
                  }}
                  className="block h-0.5 w-4 bg-white"
                ></motion.span>
              </div>
            )}
            {(toggled || matches) && (
              <motion.div
                className="top-0 left-0 z-40 flex h-full rounded-md max-md:bg-black max-md:bg-opacity-80 w-80 max-md:w-full max-md:fixed"
                variants={navMotion}
                animate="visible"
                initial="hidden"
              >
                <Aside />
              </motion.div>
            )}

            <div className="flex flex-col w-full h-full overflow-hidden grow">
              <div className="flex flex-col shrink-0">
                <div className="flex items-center px-8 py-4 shrink-0">
                  <div className="h-10 flex w-full max-w-[400px] transition-all hover:max-w-[600px] relative max-md:ml-6">
                    <Input type="text" placeholder="Search…" readOnly />
                    <div className="absolute inset-y-0 right-0 flex items-center pl-2 pr-6 text-gray-500">
                      <IconSearch size={24} />
                    </div>
                  </div>
                  <div
                    className="flex items-center gap-4 pl-8 ml-auto shrink-0"
                    onClick={() => createConfetti()}
                  >
                    <img
                      className="w-8 h-8 rounded-full"
                      src="https://avatars.githubusercontent.com/u/1227139"
                      alt="Kane Blueriver"
                    />
                    <span className="text-sm text-gray-400 max-sm:hidden">
                      Kane Blueriver
                    </span>
                  </div>
                </div>
              </div>

              <div className="relative flex flex-col overflow-y-hidden grow bg-[rgba(16,18,27,.4)]">
                <div
                  className="flex flex-col mt-1 overflow-x-hidden overflow-y-auto grow"
                  ref={container}
                >
                  <motion.div
                    className="fixed top-0 left-0 right-0 h-1 origin-left bg-orange-500"
                    style={{ scaleX: scrollYProgress }}
                  />
                  {children}
                </div>
              </div>
            </div>
          </Container>
          {confetti}
        </Background>
        <Analytics />
      </body>
    </html>
  )
}
