import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/context/AuthContext"
import Navbar from "@/components/Navbar"
import { Toaster } from "react-hot-toast"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "CarGo - Premium Car Booking",
  description: "Book your dream car with ease. Premium vehicles at affordable prices.",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: { background: "#1e293b", color: "#fff", borderRadius: "10px" },
              success: { iconTheme: { primary: "#10b981", secondary: "#fff" } },
              error: { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  )
}
