'use client'
import { GitHubGist as Gist } from '@kxxoling/react-github'
import { DiscussionEmbed } from 'disqus-react'
import { MDXRemote } from 'next-mdx-remote'

import instinctComponents from './InstinctComponents'

// @ts-ignore
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function PostDetails({ slug, frontMatter, mdxSource }) {
  const components = {
    ...instinctComponents,
    Gist,
  }

  return (
    <div className="mt-16 px-8 text-gray-200">
      <div className="mt-4 leading-loose">
        {frontMatter.title && (
          <h1 className="text-bold mx-8 text-center text-3xl">
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
      </div>
    </div>
  )
}
