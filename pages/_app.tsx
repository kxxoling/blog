/* eslint-disable @next/next/no-img-element */
import type { AppProps } from 'next/app'

import { IconSearch } from '@tabler/icons-react'
import { Analytics } from '@vercel/analytics/react'
import 'highlight.js/styles/xcode.css'
import Head from 'next/head'
import styled from 'styled-components'
import tw from 'twin.macro'

import Aside from '../components/Aside'
import useConfetti from '../components/Confetti'

import '../styles/globals.css'

const Container = tw.div`
  p-2
  bg-[#1f1d2b]
  max-w-[1360px]
  max-h-[1200px]
  h-[95vh]
  flex
  w-full
  rounded-lg
  relative
  shadow-lg
  overflow-hidden
`

const Background = styled.div`
  background-image: url('https://images.unsplash.com/photo-1520045892732-304bc3ac5d8e?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1950&q=80');
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  background-blend-mode: color-dodge;
  background-color: rgba(18, 21, 39, 0.86);

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
bg-[#353340] rounded-md
text-sm text-white
px-4 py-2 shadow-sm
outline-none
hover:ring-2 ring-[#ff7551]
cursor-not-allowed
`

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  const [createConfetti, confetti] = useConfetti()
  return (
    <>
      <Head>
        <title>山人多呓语，浮世笑百姿</title>
        <link rel="icon" type="image/x-icon" href="/logo.png" />
      </Head>

      <Background>
        <Container>
          <Aside />

          <div className="flex flex-col w-full h-full grow">
            <div className="flex flex-col shrink-0">
              <div className="flex items-center px-8 py-8 shrink-0">
                <div className="h-10 flex w-full max-w-[400px] transition-all hover:max-w-[600px] relative">
                  <Input type="text" placeholder="Search…" readOnly />
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
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

            <div className="relative flex flex-col mx-8 overflow-y-hidden grow">
              <div className="z-10 text-4xl pb-4 w-full text-white shrink-0 bg-gradient-to-b from-[#1f1d2b] absolute top-0 insect-x-0" />
              <div className="flex flex-col mt-1 overflow-x-hidden overflow-y-auto grow">
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
