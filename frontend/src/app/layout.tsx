import "./globals.css"

export const metadata = {
  title: "QMEET - Autonomous Meeting Intelligence",
  description: "The end of forgotten action items. QMEET's 6 AI agents extract every commitment and follow up until completion.",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}