export {}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_WORK_EXP: string
      NEXT_PUBLIC_ALGOLIA_APP_ID: string
      NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY: string
      NEXT_PUBLIC_ALGOLIA_INDEX_NAME: string
      ALGOLIA_SEARCH_ADMIN_KEY: string
    }
  }
}
