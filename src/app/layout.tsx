import type { Metadata } from 'next'

import { PageLayout } from '@/components/Layout'

export const metadata: Metadata = {
  title: '山人多呓语，浮世笑百姿',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}): JSX.Element {
  return (
    <html lang="en">
      <body className="dark">
        <PageLayout>{children}</PageLayout>
      </body>
    </html>
  )
}
