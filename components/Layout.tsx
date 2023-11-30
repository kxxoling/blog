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
    className="w-full h-full bg-[#ffffff20] rounded-md hover:bg-[#ffffff10] active:bg-[#ffffff10] text-sm text-white px-6 py-2 shadow-sm outline-none hover:ring-2 ring-[#ff7551] cursor-not-allowed"
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
    <html lang="en">
      <body>
        <div className="flex flex-col items-center justify-center py-0 lg:py-8 lg:px-4 w-screen overflow-hidden h-screen before:w-full before:h-screen before:fixed before:top-0 before:left-0 before:opacity-40 before:content-[''] before:bg-gradient-to-[137deg] before:from-[#38288e 21%] before:to-[rgba(32, 17, 122, 0.3) 64%] bg-center bg-cover bg-no-repeat bg-blend bg-blend-color-dodge bg-macDesktop">
          <div className="p-0 md:p-2 bg-[rgba(16,18,27,.4)] max-w-[1360px] max-h-[1200px] h-full lg:h-[95vh] w-full max-md:h-screen flex rounded-lg relative shadow-lg overflow-hidden before:backdrop-blur-lg">
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

            <div className="fixed inset-0 w-full h-full max-w-lg">
              <div className="absolute -top-4 -left-0 w-64 h-64 bg-purple-700 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob"></div>
              <div className="absolute top-20 -right-0 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-2000"></div>
              <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-4000"></div>
              <div className="m-8 relative space-y-4"></div>
            </div>

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
          </div>
          {confetti}
        </div>
        <Analytics />
      </body>
    </html>
  )
}
