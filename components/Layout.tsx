/* eslint-disable @next/next/no-img-element */
'use client'

import { IconSearch } from '@tabler/icons-react'
import { Analytics } from '@vercel/analytics/react'
import { motion, useScroll } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useMedia } from 'react-use'

import Aside from '@/components/Aside'
import useConfetti from '@/components/Confetti'

import '../styles/globals.css'

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (
  props
) => (
  <input
    {...props}
    className="h-full w-full cursor-not-allowed rounded-md bg-[#ffffff20] px-6 py-2 text-sm text-white shadow-sm outline-none ring-[#ff7551] hover:bg-[#ffffff10] hover:ring-2 active:bg-[#ffffff10]"
  />
)

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
    <>
      <div className="before:bg-gradient-to-[137deg] before:from-[#38288e 21%] before:to-[rgba(32, 17, 122, 0.3) 64%] bg-blend flex h-screen w-screen flex-col items-center justify-center overflow-hidden bg-macDesktop bg-cover bg-center bg-no-repeat py-0 bg-blend-color-dodge before:fixed before:left-0 before:top-0 before:h-screen before:w-full before:opacity-40 before:content-[''] lg:px-4 lg:py-8">
        <div className="relative flex h-full max-h-[1200px] w-full max-w-[1360px] overflow-hidden rounded-lg bg-[rgba(16,18,27,.4)] p-0 shadow-lg before:backdrop-blur-lg max-md:h-screen md:p-2 lg:h-[95vh]">
          {!matches && (
            <div
              onClick={() => {
                setToggled((prev) => !prev)
              }}
              className="fixed left-4 top-10 z-50 cursor-pointer select-none space-y-1"
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
              className="left-0 top-0 z-40 flex h-full w-80 rounded-md max-md:fixed max-md:w-full max-md:bg-black max-md:bg-opacity-80"
              variants={navMotion}
              animate="visible"
              initial="hidden"
            >
              <Aside />
            </motion.div>
          )}

          <div className="max-w-lg fixed inset-0 h-full w-full">
            <div className="absolute -left-0 -top-4 h-64 w-64 animate-blob rounded-full bg-purple-700 opacity-50 mix-blend-multiply blur-xl filter"></div>
            <div className="animation-delay-2000 absolute -right-0 top-20 h-80 w-80 animate-blob rounded-full bg-yellow-300 opacity-50 mix-blend-multiply blur-xl filter"></div>
            <div className="animation-delay-4000 absolute -bottom-8 left-20 h-72 w-72 animate-blob rounded-full bg-pink-300 opacity-50 mix-blend-multiply blur-xl filter"></div>
            <div className="relative m-8 space-y-4"></div>
          </div>

          <div className="flex h-full w-full grow flex-col overflow-hidden">
            <div className="flex shrink-0 flex-col">
              <div className="flex shrink-0 items-center px-8 py-4">
                <div className="relative flex h-10 w-full max-w-[400px] transition-all hover:max-w-[600px] max-md:ml-6">
                  <Input type="text" placeholder="Search…" readOnly />
                  <div className="absolute inset-y-0 right-0 flex items-center pl-2 pr-6 text-gray-500">
                    <IconSearch size={24} />
                  </div>
                </div>
                <div
                  className="ml-auto flex shrink-0 items-center gap-4 pl-8"
                  onClick={() => createConfetti()}
                >
                  <img
                    className="h-8 w-8 rounded-full"
                    src="https://avatars.githubusercontent.com/u/1227139"
                    alt="Kane Blueriver"
                  />
                  <span className="text-sm text-gray-400 max-sm:hidden">
                    Kane Blueriver
                  </span>
                </div>
              </div>
            </div>

            <div className="relative flex grow flex-col overflow-y-hidden bg-[rgba(16,18,27,.4)]">
              <div
                className="mt-1 flex grow flex-col overflow-y-auto overflow-x-hidden"
                ref={container}
              >
                <motion.div
                  className="fixed left-0 right-0 top-0 h-1 origin-left bg-orange-500"
                  style={{ scaleX: scrollYProgress }}
                />
                {children}
              </div>
            </div>
          </div>
        </div>
        {confetti}
      </div>
      <Analytics />
    </>
  )
}
