"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { HiMenu, HiX, HiOutlineUser, HiOutlineLogout } from "react-icons/hi"
import { BiCar } from "react-icons/bi"

export default function Navbar() {
  const { user, loading, logout } = useAuth()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const isAdminRoute = pathname?.startsWith("/admin")

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/cars", label: "Cars" },
    { href: "/about", label: "About" },
  ]

  if (user) {
    navLinks.push({ href: "/dashboard", label: "Dashboard" })
    navLinks.push({ href: "/bookings", label: "My Bookings" })
  }

  return (
    <nav className="bg-white border-b border-dark-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-md">
              <BiCar className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-dark-900">
              Car<span className="text-primary-600">Go</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "bg-primary-50 text-primary-600"
                    : "text-dark-600 hover:text-dark-900 hover:bg-dark-50"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {loading ? (
              <div className="w-8 h-8 bg-dark-100 rounded-full animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-3">
                <Link
                  href={isAdminRoute ? "/admin" : "/dashboard"}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-dark-50 hover:bg-dark-100 transition-colors"
                >
                  <div className="w-7 h-7 bg-primary-100 rounded-full flex items-center justify-center">
                    <HiOutlineUser className="w-4 h-4 text-primary-600" />
                  </div>
                  <span className="text-sm font-medium text-dark-700">{user.name}</span>
                </Link>
                {isAdminRoute && (
                  <Link
                    href="/admin"
                    className="px-3 py-2 text-sm font-medium text-primary-600 hover:text-primary-700"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="p-2 text-dark-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                  title="Logout"
                >
                  <HiOutlineLogout className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="btn-secondary text-sm py-2 px-4">
                  Sign In
                </Link>
                <Link href="/register" className="btn-primary text-sm py-2 px-4">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-dark-50"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-dark-100 bg-white">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "bg-primary-50 text-primary-600"
                    : "text-dark-600 hover:bg-dark-50"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-dark-100 pt-3 mt-3">
              {user ? (
                <button
                  onClick={() => {
                    logout()
                    setIsOpen(false)
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <HiOutlineLogout className="w-4 h-4" /> Sign Out
                </button>
              ) : (
                <div className="space-y-1">
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2.5 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2.5 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
