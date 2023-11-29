// FIXME: merge classes

type FC = React.FC<React.PropsWithChildren>

const h1: FC = ({ children, ...rest }) => (
  <h1
    className="my-8 text-3xl font-bold text-center text-blue-400 text-shadow-xl"
    {...rest}
  >
    {children}
  </h1>
)

const Image: FC = ({ children, ...rest }) => (
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  <img className="mx-auto max-w-[80%]" {...rest}>
    {children}
  </img>
)

// const h2 = styled.h2`
//   ${tw`mt-8 mb-4 text-2xl font-bold text-[#ff7551]`}
//   ${css`
//     &::before {
//       content: '§';
//       ${tw`mr-2`}
//     }
//   `}
// `
const h2: FC = ({ children, ...rest }) => (
  <h2
    {...rest}
    className="mt-8 mb-4 text-2xl font-bold text-[#ff7551] before:content-['§'] before:mr-2"
  >
    {children}
  </h2>
)

// const h3 = styled.h3`
//   ${tw`mt-6 mb-4 text-xl font-semibold text-[#ff7551]`}
//   ${css`
//     &::before {
//       content: '§';
//       ${tw`mr-2 font-extralight`}
//     }
//   `}
// `
const h3: FC = ({ children, ...rest }) => (
  <h3
    className="mt-6 mb-4 text-xl font-semibold text-[#ff7551] before:content-['§'] before:mr-2 before:font-extralight"
    {...rest}
  >
    {children}
  </h3>
)

const p: FC = ({ children, ...rest }) => (
  <p className="my-3" {...rest}>
    {children}
  </p>
)

const a: FC = ({ children, ...rest }) => (
  <a className="dark:text-blue-200" {...rest}>
    {children}
  </a>
)

const code: FC = ({ children, ...rest }) => (
  <code {...rest} className="inline-block px-2 rounded-md bg-[rgb(0,0,0,0.2)]">
    {children}
  </code>
)

const hr: FC = ({ children, ...rest }) => (
  <hr
    className="border-b-2 border-gray-200 dark:border-gray-800 opacity-50"
    {...rest}
  >
    {children}
  </hr>
)

const pre: FC = ({ children, ...rest }) => (
  <pre
    {...rest}
    className="bg-[rgba(0,0,0,0.2)] rounded-md text-sm overflow-hidden [&_code]:bg-unset [&_code]:p-6 [&_code]:overflow-x-auto [&_code]:w-full"
  >
    {children}
  </pre>
)

const ul: FC = ({ children, ...rest }) => (
  <ul className="pl-4 list-disc" {...rest}>
    {children}
  </ul>
)

const ol: FC = ({ children, ...rest }) => (
  <ol className="pl-4 list-decimal" {...rest}>
    {children}
  </ol>
)

const li: FC = ({ children, ...rest }) => (
  <li className="py-1 list-item" {...rest}>
    {children}
  </li>
)

const blockquote: FC = ({ children, ...rest }) => (
  <blockquote
    className="px-4 py-2 my-3 rounded-md bg-gray-700/10 [&_p]:first:mt-0 [&_p]:last:mb-0"
    {...rest}
  >
    {children}
  </blockquote>
)

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
