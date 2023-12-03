// FIXME: merge classes

type FC = React.FC<React.PropsWithChildren>

const h1: FC = ({ children, ...rest }) => (
  <h1
    className="my-8 text-center text-3xl font-bold text-blue-400 text-shadow-xl"
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

const h2: FC = ({ children, ...rest }) => (
  <h2
    {...rest}
    className="mb-4 mt-8 text-2xl font-bold text-[#ff7551] before:mr-2 before:content-['§']"
  >
    {children}
  </h2>
)

const h3: FC = ({ children, ...rest }) => (
  <h3
    className="mb-4 mt-6 text-xl font-semibold text-[#ff7551] before:mr-2 before:font-extralight before:content-['§']"
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
  <code {...rest} className="inline-block rounded-md bg-[rgb(0,0,0,0.2)] px-2">
    {children}
  </code>
)

const hr: FC = ({ children, ...rest }) => (
  <hr
    className="border-b-2 border-gray-200 opacity-50 dark:border-gray-800"
    {...rest}
  >
    {children}
  </hr>
)

const pre: FC = ({ children, ...rest }) => (
  <pre
    {...rest}
    className="[&_code]:bg-unset overflow-hidden rounded-md bg-[rgba(0,0,0,0.2)] text-sm [&_code]:w-full [&_code]:overflow-x-auto [&_code]:p-6"
  >
    {children}
  </pre>
)

const ul: FC = ({ children, ...rest }) => (
  <ul className="list-disc pl-4" {...rest}>
    {children}
  </ul>
)

const ol: FC = ({ children, ...rest }) => (
  <ol className="list-decimal pl-4" {...rest}>
    {children}
  </ol>
)

const li: FC = ({ children, ...rest }) => (
  <li className="list-item py-1" {...rest}>
    {children}
  </li>
)

const blockquote: FC = ({ children, ...rest }) => (
  <blockquote
    className="my-3 rounded-md bg-gray-700/10 px-4 py-2 [&_p]:first:mt-0 [&_p]:last:mb-0"
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
