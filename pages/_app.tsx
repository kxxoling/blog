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

      <header className="navigation md:sticky top-0 w-full z-40 bg-white text-gray-700 body-font shadow-md">
        <div className="w-full px-5" style={{ minHeight: '80px' }}>
          <div className="container mx-auto flex flex-wrap py-5 flex-col lg:flex-row items-center">
            <nav
              className={`
                sm:text-center
                md:text-center md:ml-4 md:py-1 md:pl-4
                lg:mr-auto lg:mb-0 lg:border-l lg:border-gray-400
                mb-6 flex flex-wrap items-center justify-center cursor-pointer text-base
              `}
            >
              <Link href="/">
                <a className="mr-4 mb-2  md:mr-3 md:mb-0  lg:mr-5" title="Home">
                  Home
                </a>
              </Link>

              <Link href="/bio">
                <a className="mr-4 mb-2  md:mr-3 md:mb-0  lg:mr-5" title="Bio">
                  Bio
                </a>
              </Link>

              <Link href="/pages/friend-links">
                <a className="mr-4 mb-2  md:mr-3 md:mb-0  lg:mr-5" title="Bio">
                  Friends
                </a>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="scrollable">
        <section className="w-full bg-gray-200 py-4">
          <div className="container justify-center flex max-w-2xl m-auto leading-none ">
            <span className="">
              🚧 🚧 🚧 页面施工中，欢迎稍后回来！🚧 🚧 🚧
            </span>
          </div>
        </section>

        <div className="flex flex-col-reverse gap-6 xl:flex-row p-6 pb-16 justify-center">
          <div className="prose w-full max-w-200 flex-grow">
            <div className="container">
              <main>
                <Component {...pageProps} />
              </main>
            </div>
          </div>

          <div className="sidebar w-full md:w-1/5 px-4 mb-4 md:mb-0">
            <aside className="position-staitc top-auto bottom-auto w-auto">
              <section className="mx-auto mb-8">
                <div className="text-center">
                  <div className="relative">
                    <div className="avatar" style={{ maxWidth: '100%' }}>
                      <div className="w-64 rounded-full border-4 border-white shadow-md">
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
              <section className="sidebar__section sidebar__section__work flex flex-wrap">
                <div className="sidebar__section__work_link mx-auto text-center mb-8">
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
