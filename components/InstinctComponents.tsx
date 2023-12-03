import { cn } from '@/utils/cn'

type FC<T = unknown> = React.FC<
  React.PropsWithChildren & React.HTMLAttributes<T>
>

const h1: FC = ({ className, children, ...rest }) => (
  <h1
    className={cn(
      'my-8 text-center text-3xl font-bold text-blue-400 text-shadow-xl'
    )}
    {...rest}
  >
    {children}
  </h1>
)

const Image: FC = ({ className, children, ...rest }) => (
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  <img className={cn(className, 'mx-auto max-w-[80%]')} {...rest}>
    {children}
  </img>
)

const h2: FC = ({ className, children, ...rest }) => (
  <h2
    {...rest}
    className={cn(
      className,
      "mb-4 mt-8 text-2xl font-bold text-[#ff7551] before:mr-2 before:content-['§']"
    )}
  >
    {children}
  </h2>
)

const h3: FC = ({ className, children, ...rest }) => (
  <h3
    className={cn(
      className,
      "mb-4 mt-6 text-xl font-semibold text-[#ff7551] before:mr-2 before:font-extralight before:content-['§']"
    )}
    {...rest}
  >
    {children}
  </h3>
)

const p: FC = ({ className, children, ...rest }) => (
  <p className={cn(className, 'my-3')} {...rest}>
    {children}
  </p>
)

const a: FC = ({ className, children, ...rest }) => (
  <a className={cn(className, 'dark:text-blue-200')} {...rest}>
    {children}
  </a>
)

const code: FC = ({ className, children, ...rest }) => (
  <code
    {...rest}
    className={cn(
      className,
      'inline-block rounded-md bg-[rgb(0,0,0,0.2)] px-2'
    )}
  >
    {children}
  </code>
)

const hr: FC = ({ className, children, ...rest }) => (
  <hr
    className={cn(
      className,
      'border-b-2 border-gray-200 opacity-50 dark:border-gray-800'
    )}
    {...rest}
  >
    {children}
  </hr>
)

const pre: FC = ({ className, children, ...rest }) => (
  <pre
    {...rest}
    className={cn(
      className,
      '[&_code]:bg-unset overflow-hidden rounded-md bg-[rgba(0,0,0,0.2)] text-sm [&_code]:w-full [&_code]:overflow-x-auto [&_code]:p-6'
    )}
  >
    {children}
  </pre>
)

const ul: FC = ({ className, children, ...rest }) => (
  <ul className={cn(className, 'list-disc pl-4')} {...rest}>
    {children}
  </ul>
)

const ol: FC = ({ className, children, ...rest }) => (
  <ol className={cn(className, 'list-decimal pl-4')} {...rest}>
    {children}
  </ol>
)

const li: FC = ({ className, children, ...rest }) => (
  <li className={cn(className, 'list-item py-1')} {...rest}>
    {children}
  </li>
)

const blockquote: FC = ({ className, children, ...rest }) => (
  <blockquote
    className={cn(
      className,
      'my-3 rounded-md bg-gray-700/10 px-4 py-2 [&_p]:first:mt-0 [&_p]:last:mb-0'
    )}
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
