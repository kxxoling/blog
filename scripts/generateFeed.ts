import { generateRssFeed, getSortedPosts } from '../src/utils/feed'

async function main() {
  const posts = await getSortedPosts()
  await generateRssFeed(posts)
}

main()
