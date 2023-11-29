/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs')
const path = require('path')

const algoliasearch = require('algoliasearch')
// eslint-disable-next-line node/no-unpublished-require
const dotenv = require('dotenv')
const matter = require('gray-matter')
const removeMd = require('remove-markdown')

const CONTENT_PATH = path.join(process.cwd(), 'posts/')

async function getFiles(dir) {
  const dirents = await fs.promises.readdir(dir, { withFileTypes: true })
  // @ts-ignore
  const files = await Promise.all(
    dirents
      .filter((dirent) => !dirent.name.startsWith('.'))
      .map((dirent) => {
        return dirent.isDirectory()
          ? getFiles(path.join(dir, dirent.name))
          : path.join(dir, dirent.name)
      })
  )
  return Array.prototype.concat(...files)
}
const contentFilePaths = await getFiles(CONTENT_PATH)

async function getAllBlogPosts() {
  const articles = contentFilePaths.map((filePath) => {
    const source = fs.readFileSync(filePath)
    const { content, data } = matter(source)

    return {
      content,
      data,
      filePath: filePath.replace(CONTENT_PATH, ''),
    }
  })

  return articles
}

function transformPostsToSearchObjects(articles) {
  const transformed = articles.map((article) => {
    return {
      objectID: article.filePath,
      title:
        article.data.title ||
        article.content.split('\n')[0].replace('#', '').trim(),
      description: article.data.description,
      slug: article.filePath.replace(/\.(md|mdx)$/, ''),
      tagsCollection: { tags: article.data.tags },
      date: article.data.createdAt || article.data.updatedAt,
      type: 'article',
      content: removeMd(article.content).slice(0, 3000),
    }
  })

  return transformed
}

// @ts-ignore @typescript-eslint/no-extra-semi
// eslint-disable-next-line @typescript-eslint/no-extra-semi
;(async function () {
  dotenv.config()

  try {
    const articles = await getAllBlogPosts()

    const transformed = transformPostsToSearchObjects(articles)

    const client = algoliasearch(
      process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
      process.env.ALGOLIA_SEARCH_ADMIN_KEY
    )

    // initialize the index with your index name
    const index = client.initIndex('blog.windrunner.me')

    // add the data to the index
    const algoliaResponse = await index.saveObjects(transformed)

    console.log(
      `Successfully added ${
        algoliaResponse.objectIDs.length
      } records to Algolia search! Object IDs:\n${algoliaResponse.objectIDs.join(
        '\n'
      )}`
    )
  } catch (err) {
    console.error(err)
  }
})()
