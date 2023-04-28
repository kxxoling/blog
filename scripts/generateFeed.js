/* eslint-disable @typescript-eslint/no-var-requires */
const { generateRssFeed, getSortedPosts } = require('../utils/feed')

// eslint-disable-next-line import/newline-after-import
;(async function () {
  const posts = await getSortedPosts()
  await generateRssFeed(posts)
})()
