"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuthGuard } from "@/hooks/useAuthGuard"
import bookingService from "@/services/bookingService"
import Image from "next/image"
import { BiCar, BiCheckCircle, BiXCircle, BiDollar, BiCalendar, BiRightArrowAlt } from "react-icons/bi"
import { HiClock } from "react-icons/hi"

const placeholderImage = {
  src: "/placeholder.svg?text=Car",
  height: 600,
  width: 800,
}

function getStatusBadge(status) {
  const config = {
    pending: { className: "badge-warning", icon: HiClock, bg: "bg-yellow-50 text-yellow-700" },
    confirmed: { className: "badge-info", icon: BiCheckCircle, bg: "bg-blue-50 text-blue-700" },
    completed: { className: "badge-success", icon: BiCheckCircle, bg: "bg-green-50 text-green-700" },
    cancelled: { className: "badge-danger", icon: BiXCircle, bg: "bg-red-50 text-red-700" },
  }
  const c = config[status] || config.pending
  return (
    <span className={`badge ${c.className} flex items-center gap-1.5 px-3 py-1.5 ${c.bg}`}>
      <c.icon className="w-3.5 h-3.5" />
      <span className="capitalize">{status}</span>
    </span>
  )
}

export default function DashboardPage() {
  const { user } = useAuthGuard()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await bookingService.getAll()
        setBookings(data.bookings || data)
      } catch (err) {
        console.error("Error fetching bookings:", err)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const totalSpent = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0)

  const stats = [
    { icon: <BiCar className="w-7 h-7" />, label: "Total Bookings", value: bookings.length, color: "from-blue-500 to-blue-600", shadow: "shadow-blue-500/30" },
    { icon: <BiCheckCircle className="w-7 h-7" />, label: "Confirmed", value: bookings.filter((b) => b.status === "confirmed").length, color: "from-green-500 to-green-600", shadow: "shadow-green-500/30" },
    { icon: <HiClock className="w-7 h-7" />, label: "Completed", value: bookings.filter((b) => b.status === "completed").length, color: "from-purple-500 to-purple-600", shadow: "shadow-purple-500/30" },
    { icon: <BiDollar className="w-7 h-7" />, label: "Total Spent", value: `₹${totalSpent.toLocaleString()}`, color: "from-orange-500 to-orange-600", shadow: "shadow-orange-500/30" },
  ]

  return (
    <div className="min-h-screen bg-dark-50">
      <div className="bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900 text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">Welcome, {user?.name}!</h1>
              <p className="text-dark-300 text-lg">Manage your bookings and profile</p>
            </div>
            <Link href="/cars" className="btn-primary flex items-center gap-2">
              <BiCar className="w-5 h-5" /> Browse Cars
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 -mt-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 lg:mb-12">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-white shadow-lg ${stat.shadow} mb-4`}>
                {stat.icon}
              </div>
              <p className="text-2xl font-bold text-dark-900">{stat.value}</p>
              <p className="text-sm text-dark-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b border-dark-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                <BiCalendar className="w-5 h-5 text-primary-600" />
              </div>
              <h2 className="text-xl font-bold text-dark-900">Recent Bookings</h2>
            </div>
            <Link href="/bookings" className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1 hover:gap-2 transition-all">
              View All <BiRightArrowAlt className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-24 h-16 bg-dark-100 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-dark-100 rounded w-1/3" />
                      <div className="h-3 bg-dark-100 rounded w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : bookings.length > 0 ? (
            <div className="divide-y divide-dark-100">
              {bookings.slice(0, 5).map((booking) => (
                <div key={booking._id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:bg-dark-50 transition-colors">
                  <div className="relative w-full sm:w-24 h-40 sm:h-16 rounded-xl overflow-hidden bg-dark-100 flex-shrink-0">
                    <Image src={booking.car?.image || placeholderImage} alt={booking.car?.name || "Car"} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-dark-900 truncate">{booking.car?.name}</h3>
                    <div className="flex flex-wrap gap-3 sm:gap-4 text-sm text-dark-500 mt-1">
                      <span className="flex items-center gap-1.5">
                        <BiCalendar className="w-3.5 h-3.5 text-primary-500" />
                        {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                      </span>
                      <span className="font-semibold text-dark-900 flex items-center gap-1">
                        <BiDollar className="w-3.5 h-3.5 text-primary-500" />
                        {booking.totalPrice?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  {getStatusBadge(booking.status)}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 sm:p-16 text-center">
              <div className="w-20 h-20 bg-dark-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BiCar className="w-10 h-10 text-dark-300" />
              </div>
              <h3 className="text-xl font-semibold text-dark-900 mb-2">No bookings yet</h3>
              <p className="text-dark-500 mb-6">Start by browsing our premium car collection</p>
              <Link href="/cars" className="btn-primary inline-flex items-center gap-2">
                <BiCar className="w-5 h-5" /> Browse Cars
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
