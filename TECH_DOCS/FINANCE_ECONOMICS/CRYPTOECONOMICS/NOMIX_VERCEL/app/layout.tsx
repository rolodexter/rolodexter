import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'rolodexter',
  description: 'AI-powered economic analysis platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
