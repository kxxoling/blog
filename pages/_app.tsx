/* eslint-disable @next/next/no-img-element */
import type { AppProps } from 'next/app'

import { IconSearch } from '@tabler/icons-react'
import { Analytics } from '@vercel/analytics/react'
import { motion, useScroll } from 'framer-motion'
import 'highlight.js/styles/xcode.css'
import Head from 'next/head'
import { useRef } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'

import Aside from '../components/Aside'
import useConfetti from '../components/Confetti'

import '../styles/globals.css'

const Container = tw.div`
  p-2
  bg-[rgba(16,18,27,.4)]
  backdrop-blur-lg
  max-w-[1360px]
  max-h-[1200px]
  h-[95vh]
  w-full
  max-md:w-screen
  max-md:h-screen

  h-screen
  flex
  rounded-lg
  relative
  shadow-lg
  overflow-hidden
`

const Background = styled.div`
  background-image: url('https://wallpapershome.com/images/wallpapers/macos-big-sur-1280x720-dark-wwdc-2020-22655.jpg');
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  background-blend-mode: color-dodge;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

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

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  const [createConfetti, confetti] = useConfetti()
  const container = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({ container })

  return (
    <>
      <Head>
        <title>山人多呓语，浮世笑百姿</title>
        <link rel="icon" type="image/x-icon" href="/logo.png" />
      </Head>

      <Background>
        <Container>
          <Aside />

          <div className="flex flex-col w-full h-full overflow-hidden grow">
            <div className="flex flex-col shrink-0">
              <div className="flex items-center px-8 py-4 shrink-0">
                <div className="h-10 flex w-full max-w-[400px] transition-all hover:max-w-[600px] relative">
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
                  <span className="text-sm text-gray-400">Kane Blueriver</span>
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
                <Component {...pageProps} />
              </div>
            </div>
          </div>
        </Container>
        {confetti}
      </Background>
      <Analytics />
    </>
  )
}

export default MyApp
