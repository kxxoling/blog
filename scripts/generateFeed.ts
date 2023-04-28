import { generateRssFeed, getSortedPosts } from '../utils/feed'

async function main() {
  const posts = await getSortedPosts()
  await generateRssFeed(posts)
}

main()
