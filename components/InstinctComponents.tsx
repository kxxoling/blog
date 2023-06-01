import styled, { css } from 'styled-components'
import tw from 'twin.macro'

const h1 = tw.h1`my-8 text-3xl font-bold text-center text-blue-400 text-shadow-xl`

const Image = styled.img`
  ${tw`mx-auto`}
  ${css`
    max-width: 80%;
  `}
`

const h2 = styled.h2`
  ${tw`mt-8 mb-4 text-2xl font-bold text-[#ff7551]`}
  ${css`
    &::before {
      content: '§';
      ${tw`mr-2`}
    }
  `}
`
const h3 = styled.h3`
  ${tw`mt-6 mb-4 text-xl font-semibold text-[#ff7551]`}
  ${css`
    &::before {
      content: '§';
      ${tw`mr-2 font-extralight`}
    }
  `}
`

const p = tw.p`my-3`

const a = tw.a`dark:text-blue-200`

const code = tw.code`
inline-block px-2 rounded-md bg-[rgb(0,0,0,0.2)]`

const hr = tw.hr`
border-b-2 border-gray-200 dark:border-gray-800 opacity-50
`
const pre = styled.pre`
  ${tw`bg-[rgba(0,0,0,0.2)] rounded-md text-sm overflow-hidden`}

  & code {
    ${tw`w-full p-6 overflow-x-auto`}
    background-color: unset;
  }
`

const ul = styled.ul`
  ${tw`pl-4 list-disc`}

  list-style-type: disc;
`

const ol = styled.ol`
  ${tw`pl-4 list-decimal`}

  list-style: decimal;
`

const li = styled.li`
  ${tw`py-1 list-item`}
`

const blockquote = styled.blockquote`
  ${tw`px-4 py-2 my-3 rounded-md bg-gray-700/10`}

  p:first-child {
    ${tw`mt-0`}
  }

  p:last-child {
    ${tw`mb-0`}
  }
`

const modules = {
  img: Image,
  h1,
  h2,
  h3,
  p,
  hr,
  a,
  pre,
  code,
  blockquote,
  ul,
  ol,
  li,
}

export default modules
