import { GitHubGist as Gist } from '@kxxoling/react-github'
import { DiscussionEmbed } from 'disqus-react'
import { MDXRemote } from 'next-mdx-remote'
import styled from 'styled-components'
import tw from 'twin.macro'

import instinctComponents from './InstinctComponents'

const PostContainer = styled.div`
  ${tw`leading-loose`}

  & > * {
    margin-bottom: 16px;
  }
`

// @ts-ignore
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function PostDetails({ slug, frontMatter, mdxSource }) {
  const components = {
    ...instinctComponents,
    Gist,
  }

  return (
    <div className="px-8 mt-16 text-gray-200">
      <PostContainer>
        {frontMatter.title && (
          <h1 className="mx-8 text-3xl text-center text-bold">
            {frontMatter.title}
          </h1>
        )}
        {/* @ts-ignore */}
        <MDXRemote {...mdxSource} components={components} />
        <div>
          <DiscussionEmbed
            shortname="wr-blog"
            config={{
              url: `https://blog.windrunner.me/${slug}`,
              identifier: `https://blog.windrunner.me/${slug}`,
              title: frontMatter.title,
              language: 'zh-CN',
            }}
          />
        </div>
      </PostContainer>
    </div>
  )
}
