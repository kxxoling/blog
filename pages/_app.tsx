import type { AppProps } from 'next/app'

import Head from 'next/head'
import Link from 'next/link'
import '../styles/globals.css'

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <>
      <Head>
        <title>Blog</title>
      </Head>

      <header className="top-0 z-40 w-full text-gray-700 bg-white shadow-md navigation md:sticky body-font">
        <div className="w-full px-5" style={{ minHeight: '80px' }}>
          <div className="container flex flex-col flex-wrap items-center py-5 mx-auto lg:flex-row">
            <nav
              className={`
                sm:text-center
                md:text-center md:ml-4 md:py-1 md:pl-4
                lg:mr-auto lg:mb-0 lg:border-l lg:border-gray-400
                mb-6 flex flex-wrap items-center justify-center cursor-pointer text-base
              `}
            >
              <Link href="/">
                <a className="mb-2 mr-4 md:mr-3 md:mb-0 lg:mr-5" title="Home">
                  Home
                </a>
              </Link>

              <Link href="/bio">
                <a className="mb-2 mr-4 md:mr-3 md:mb-0 lg:mr-5" title="Bio">
                  Bio
                </a>
              </Link>

              <Link href="/pages/friend-links">
                <a className="mb-2 mr-4 md:mr-3 md:mb-0 lg:mr-5" title="Bio">
                  Friends
                </a>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="scrollable">
        <section className="w-full py-4 bg-gray-200">
          <div className="container flex justify-center max-w-2xl m-auto leading-none ">
            <span className="">
              🚧 🚧 🚧 页面施工中，欢迎稍后回来！🚧 🚧 🚧
            </span>
          </div>
        </section>

        <div className="flex flex-col-reverse justify-center gap-6 p-6 pb-16 xl:flex-row">
          <div className="flex-grow w-full prose max-w-200">
            <div className="container">
              <main>
                <Component {...pageProps} />
              </main>
            </div>
          </div>

          <div className="w-full px-4 mb-4 sidebar md:w-1/5 md:mb-0">
            <aside className="top-auto bottom-auto w-auto position-staitc">
              <section className="mx-auto mb-8">
                <div className="text-center">
                  <div className="relative">
                    <div className="avatar" style={{ maxWidth: '100%' }}>
                      <div className="w-64 border-4 border-white rounded-full shadow-md">
                        <img
                          src="https://avatars.githubusercontent.com/u/1227139"
                          alt="Kane Blueriver"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mx-auto mt-4 text-center">
                    <a
                      target="_blank"
                      href="https://blog.windrunner.me/"
                      rel="noopener noreferrer"
                    >
                      📖
                    </a>
                    <a
                      target="_blank"
                      className="ml-4"
                      href="https://github.com/kxxoling/"
                      rel="noopener noreferrer"
                    >
                      🐙
                    </a>
                  </div>
                </div>
              </section>
              <section className="flex flex-wrap sidebar__section sidebar__section__work">
                <div className="mx-auto mb-8 text-center sidebar__section__work_link">
                  <a
                    className="w-1/2 text-gray-700 hover:text-lightseagreen-800"
                    href="https://frontmatter.codes"
                    title="Front Matter - Headless CMS running in VS Code"
                  >
                    {/* TODO */}
                  </a>
                </div>
              </section>
            </aside>
          </div>
        </div>
      </div>
    </>
  )
}

export default MyApp
