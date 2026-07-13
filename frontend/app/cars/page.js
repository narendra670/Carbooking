"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import carService from "@/services/carService"

export default function CarsPage() {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    brand: "",
    fuelType: "",
    transmission: "",
    bodyType: "",
    sort: "",
  })

  useEffect(() => {
    fetchCars()
  }, [])

  const fetchCars = async (params = {}) => {
    try {
      setLoading(true)
      setError(null)
      const data = await carService.getAll(params)
      setCars(Array.isArray(data) ? data : [])
    } catch (err) {
      setError("Failed to load cars. Please try again later.")
      setCars([])
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    const params = {}
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params[k] = v
    })
    fetchCars(params)
  }

  const brands = [...new Set(cars.map((c) => c.oem))].filter(Boolean)
  const fuelTypes = [...new Set(cars.map((c) => c.fuelType))].filter(Boolean)
  const bodyTypes = [...new Set(cars.map((c) => c.bodyType))].filter(Boolean)

  return (
    <div className="min-h-screen bg-dark-50">
      <section className="bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900 text-white py-12 sm:py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(14,165,233,0.4),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(14,165,233,0.3),transparent_50%)]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block bg-white/10 text-primary-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-4 border border-white/20">
            Our Fleet
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">Browse Our Cars</h1>
          <p className="text-dark-300 text-lg max-w-2xl mx-auto">
            Choose from our premium collection of luxury, sports, and SUV vehicles
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex flex-wrap gap-3 mb-8 pb-6 border-b border-dark-200">
          <span className="text-sm font-medium text-dark-500 mr-2 py-2">Filter:</span>
          <select
            value={filters.brand}
            onChange={(e) => handleFilterChange("brand", e.target.value)}
            className="px-3 py-1.5 text-sm font-medium rounded-lg border border-dark-200 text-dark-600 bg-white focus:outline-none focus:border-primary-400"
          >
            <option value="">All Brands</option>
            {brands.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
          <select
            value={filters.fuelType}
            onChange={(e) => handleFilterChange("fuelType", e.target.value)}
            className="px-3 py-1.5 text-sm font-medium rounded-lg border border-dark-200 text-dark-600 bg-white focus:outline-none focus:border-primary-400"
          >
            <option value="">All Fuel Types</option>
            {fuelTypes.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
          <select
            value={filters.bodyType}
            onChange={(e) => handleFilterChange("bodyType", e.target.value)}
            className="px-3 py-1.5 text-sm font-medium rounded-lg border border-dark-200 text-dark-600 bg-white focus:outline-none focus:border-primary-400"
          >
            <option value="">All Body Types</option>
            {bodyTypes.map((bt) => (
              <option key={bt} value={bt}>{bt}</option>
            ))}
          </select>
          <select
            value={filters.sort}
            onChange={(e) => handleFilterChange("sort", e.target.value)}
            className="px-3 py-1.5 text-sm font-medium rounded-lg border border-dark-200 text-dark-600 bg-white focus:outline-none focus:border-primary-400"
          >
            <option value="">Sort By</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="year-new">Newest First</option>
          </select>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-52 bg-dark-200 rounded-t-xl" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-dark-200 rounded w-3/4" />
                  <div className="h-4 bg-dark-200 rounded w-1/2" />
                  <div className="h-4 bg-dark-200 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-dark-500 text-lg">{error}</p>
            <button
              onClick={() => fetchCars()}
              className="btn-primary mt-4"
            >
              Retry
            </button>
          </div>
        ) : cars.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-dark-500 text-lg">No cars found matching your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {cars.map((car) => (
              <div key={car.used_car_sku_id} className="card group">
                <div className="relative h-52 overflow-hidden bg-dark-100">
                  {car.image ? (
                    <Image
                      src={car.image}
                      alt={`${car.oem} ${car.model}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-dark-100">
                      <svg className="w-16 h-16 text-dark-300" fill="currentColor" viewBox="0 0 512 512">
                        <path d="M499.99 176h-59.87l-16.64-41.6C406.38 91.63 365.57 64 319.5 64h-127c-46.06 0-86.88 27.63-103.99 70.4L71.87 176H12.01C4.2 176-1.53 183.34.37 190.91l6 24C7.7 220.25 12.5 224 18.01 224h20.07C24.65 235.73 16 252.78 16 272v48c0 16.12 6.16 30.67 16 41.93V416c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-32h256v32c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-54.07c9.84-11.25 16-25.8 16-41.93v-48c0-19.22-8.65-36.27-22.07-48H494c5.51 0 10.31-3.75 11.64-9.09l6-24c1.89-7.57-3.84-14.91-11.65-14.91z" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className={`badge ${car.isAvailable !== false ? "badge-success" : "badge-warning"}`}>
                      {car.isAvailable !== false ? "Available" : "Booked"}
                    </span>
                  </div>
                  {car.bodyType && (
                    <div className="absolute top-3 right-3">
                      <span className="bg-white/90 backdrop-blur-sm text-dark-800 text-xs font-bold px-2.5 py-1 rounded-lg">
                        {car.bodyType}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-dark-900 mb-1">{car.oem} {car.model}</h3>
                  <p className="text-sm text-dark-500 mb-3">{car.variant_name || car.bodyType || ""}</p>
                  <div className="flex items-center gap-4 mb-4 text-sm text-dark-500">
                    {car.seating && (
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 640 512"><path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512h388.6c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304h-91.4z"/></svg>
                        {car.seating} Seats
                      </span>
                    )}
                    {car.fuelType && <span>{car.fuelType}</span>}
                    {car.transmission && <span>{car.transmission}</span>}
                    {car.year && <span>{car.year}</span>}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-dark-100">
                    <div>
                      <span className="text-2xl font-bold text-primary-600">&#8377;{(car.dailyRate || car.price || 0).toLocaleString()}</span>
                      <span className="text-sm text-dark-500">/day</span>
                    </div>
                    <Link
                      href="/contact"
                      className="btn-primary text-sm py-2 px-4"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
