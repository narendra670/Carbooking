"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import carService from "@/services/carService"

const image1 = "/hero-car.jpg"
const image5 = "/about-car.jpg"

export default function Home() {
  const [featuredCars, setFeaturedCars] = useState([])

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await carService.getAll()
        setFeaturedCars(Array.isArray(data) ? data.slice(0, 3) : [])
      } catch {
        setFeaturedCars([])
      }
    }
    fetchFeatured()
  }, [])

  return (
    <div>
      <section className="relative bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <Image src={image1} alt="Luxury car background" fill className="object-cover opacity-20" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-dark-900/95 via-dark-900/80 to-dark-900/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900/50 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pt-16 pb-12 sm:pt-24 sm:pb-16 lg:pt-32 lg:pb-24">
            <div className="max-w-3xl animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-primary-600/20 border border-primary-500/30 rounded-full px-4 py-2 mb-6 backdrop-blur-sm">
                <svg className="w-4 h-4 text-primary-400" fill="currentColor" viewBox="0 0 576 512">
                  <path d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z" />
                </svg>
                <span className="text-sm font-medium text-primary-300">Trusted by 10,000+ customers</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Drive Your{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-300">
                  Dream Car
                </span>{" "}
                Today
              </h1>

              <p className="text-base sm:text-lg lg:text-xl text-dark-300 mb-8 leading-relaxed max-w-2xl">
                Premium vehicles at affordable prices. Book instantly with verified cars, transparent pricing,
                and 24/7 support.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link
                  href="/cars"
                  className="group bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold py-3.5 px-8 rounded-xl transition-all duration-300 shadow-xl shadow-primary-600/40 hover:shadow-primary-700/50 hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 512 512">
                    <path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z" />
                  </svg>
                  Explore Cars
                </Link>
                <Link
                  href="/register"
                  className="group border-2 border-white/30 text-white hover:bg-white hover:text-dark-900 font-semibold py-3.5 px-8 rounded-xl transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2 backdrop-blur-sm"
                >
                  Get Started
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[
                { icon: "car", label: "50+ Cars", desc: "Premium fleet", color: "from-blue-500 to-blue-600" },
                { icon: "calendar", label: "Instant", desc: "Quick booking", color: "from-green-500 to-green-600" },
                { icon: "shield", label: "Insured", desc: "Full coverage", color: "from-purple-500 to-purple-600" },
                { icon: "headset", label: "24/7", desc: "Support", color: "from-orange-500 to-orange-600" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="group bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 text-center border border-white/10 hover:bg-white/15 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${item.color} mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
                    <svg className="w-6 sm:w-8 h-6 sm:h-8" fill="currentColor" viewBox="0 0 512 512">
                      <path d="M499.99 176h-59.87l-16.64-41.6C406.38 91.63 365.57 64 319.5 64h-127c-46.06 0-86.88 27.63-103.99 70.4L71.87 176H12.01C4.2 176-1.53 183.34.37 190.91l6 24C7.7 220.25 12.5 224 18.01 224h20.07C24.65 235.73 16 252.78 16 272v48c0 16.12 6.16 30.67 16 41.93V416c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-32h256v32c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-54.07c9.84-11.25 16-25.8 16-41.93v-48c0-19.22-8.65-36.27-22.07-48H494c5.51 0 10.31-3.75 11.64-9.09l6-24c1.89-7.57-3.84-14.91-11.65-14.91z" />
                    </svg>
                  </div>
                  <div className="text-lg sm:text-xl font-bold">{item.label}</div>
                  <div className="text-xs sm:text-sm text-dark-400">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-24 bg-gradient-to-t from-white to-transparent" />
      </section>

      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <span className="inline-block bg-primary-100 text-primary-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              Our Fleet
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-dark-900 mb-4">Featured Cars</h2>
            <p className="text-dark-500 text-lg max-w-2xl mx-auto">
              Choose from our premium collection of vehicles for every occasion
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {featuredCars.length > 0 ? featuredCars.map((car) => (
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
                    <span className="badge badge-success">Available</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-dark-900 mb-1">{car.oem} {car.model}</h3>
                  <p className="text-sm text-dark-500 mb-3">{car.variant_name || car.bodyType || ""}</p>
                  <div className="flex items-center gap-4 mb-4 text-sm text-dark-500">
                    {car.seating && <span>{car.seating} Seats</span>}
                    {car.fuelType && <span>{car.fuelType}</span>}
                    {car.transmission && <span>{car.transmission}</span>}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-dark-100">
                    <div>
                      <span className="text-2xl font-bold text-primary-600">&#8377;{(car.dailyRate || car.price || 0).toLocaleString()}</span>
                      <span className="text-sm text-dark-500">/day</span>
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              [1, 2, 3].map((i) => (
                <div key={i} className="card animate-pulse">
                  <div className="h-52 bg-dark-200 rounded-t-xl" />
                  <div className="p-5 space-y-3">
                    <div className="h-5 bg-dark-200 rounded w-3/4" />
                    <div className="h-4 bg-dark-200 rounded w-1/2" />
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="text-center mt-12">
            <Link href="/cars" className="btn-primary text-lg inline-flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 512 512">
                <path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z" />
              </svg>
              View All Cars
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(14,165,233,0.3),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(14,165,233,0.2),transparent_50%)]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <span className="inline-block bg-white/10 text-primary-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-4 border border-white/20">
              Simple Process
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-dark-300 text-lg max-w-2xl mx-auto">Book your dream car in just 3 simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                num: "01",
                title: "Choose Your Car",
                desc: "Browse our premium fleet and select the perfect car for your needs and budget.",
              },
              {
                num: "02",
                title: "Book & Pay",
                desc: "Select your dates, review transparent pricing, and complete your booking securely.",
              },
              {
                num: "03",
                title: "Enjoy Your Ride",
                desc: "Pick up your car and hit the road with full insurance coverage and 24/7 support.",
              },
            ].map((step, i) => (
              <div key={i} className="text-center group relative">
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-xl shadow-primary-600/30">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 512 512">
                      <path d="M499.99 176h-59.87l-16.64-41.6C406.38 91.63 365.57 64 319.5 64h-127c-46.06 0-86.88 27.63-103.99 70.4L71.87 176H12.01C4.2 176-1.53 183.34.37 190.91l6 24C7.7 220.25 12.5 224 18.01 224h20.07C24.65 235.73 16 252.78 16 272v48c0 16.12 6.16 30.67 16 41.93V416c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-32h256v32c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-54.07c9.84-11.25 16-25.8 16-41.93v-48c0-19.22-8.65-36.27-22.07-48H494c5.51 0 10.31-3.75 11.64-9.09l6-24c1.89-7.57-3.84-14.91-11.65-14.91z" />
                    </svg>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-primary-600 text-sm font-bold shadow-lg">
                    {step.num}
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold mb-3 group-hover:text-primary-300 transition-colors">
                  {step.title}
                </h3>
                <p className="text-dark-300 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 lg:py-24 bg-dark-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <span className="inline-block bg-primary-100 text-primary-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
                Why Choose Us
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-dark-900 mb-6">
                The Best Car Rental Experience
              </h2>
              <p className="text-dark-500 text-lg mb-8 leading-relaxed">
                We provide the best car rental experience with transparent pricing, premium vehicles,
                and exceptional customer service.
              </p>
              <div className="space-y-4">
                {[
                  "Transparent Pricing",
                  "Premium Fleet",
                  "24/7 Roadside Assistance",
                  "Free Cancellation",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 group">
                    <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0 text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 512 512">
                        <path d="M466.5 83.7l-192-80a48.15 48.15 0 0 0-36.9 0l-192 80C27.7 91.1 16 108.6 16 128c0 198.5 114.5 335.7 221.5 380.3 11.8 4.9 25.1 4.9 36.9 0C360.1 472.6 496 349.3 496 128c0-19.4-11.7-36.9-29.5-44.3zM256.1 446.3l-.1-381 175.9 73.3c-3.3 151.4-82.1 261.1-175.8 307.7z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-dark-900 mb-1">{item}</h3>
                      <p className="text-dark-500 text-sm">
                        {i === 0 && "No hidden fees. What you see is what you pay."}
                        {i === 1 && "Well-maintained vehicles from top brands."}
                        {i === 2 && "Help whenever you need it, anywhere."}
                        {i === 3 && "Cancel up to 24 hours before pickup for free."}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="relative h-64 sm:h-80 lg:h-96 rounded-2xl overflow-hidden shadow-2xl">
                <Image src={image5} alt="Premium car rental" fill className="object-cover" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-6 hidden sm:block">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
                    <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 512 512">
                      <path d="M192 208c0-17.67-14.33-32-32-32h-16c-35.35 0-64 28.65-64 64v48c0 35.35 28.65 64 64 64h16c17.67 0 32-14.33 32-32V208zm176 144c35.35 0 64-28.65 64-64v-48c0-35.35-28.65-64-64-64h-16c-17.67 0-32 14.33-32 32v112c0 17.67 14.33 32 32 32h16zM256 0C113.18 0 4.58 118.83 0 256v16c0 8.84 7.16 16 16 16h16c8.84 0 16-7.16 16-16v-16c0-114.69 93.31-208 208-208s208 93.31 208 208h-.12c.08 2.43.12 165.72.12 165.72 0 23.35-18.93 42.28-42.28 42.28H320c0-26.51-21.49-48-48-48h-32c-26.51 0-48 21.49-48 48s21.49 48 48 48h181.72c49.86 0 90.28-40.42 90.28-90.28V256C507.42 118.83 398.82 0 256 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-dark-900">24/7</p>
                    <p className="text-sm text-dark-500">Customer Support</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.05),transparent_50%)]" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">Ready to Hit the Road?</h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of happy customers who trust CarGo for their car rental needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-white text-primary-600 hover:bg-dark-50 font-semibold py-4 px-10 rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 text-lg"
            >
              Create Free Account
            </Link>
            <Link
              href="/cars"
              className="border-2 border-white text-white hover:bg-white/10 font-semibold py-4 px-10 rounded-xl transition-all duration-300 hover:-translate-y-0.5 text-lg"
            >
              Browse Cars
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-dark-900 text-dark-300 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 512 512">
                  <path d="M499.99 176h-59.87l-16.64-41.6C406.38 91.63 365.57 64 319.5 64h-127c-46.06 0-86.88 27.63-103.99 70.4L71.87 176H12.01C4.2 176-1.53 183.34.37 190.91l6 24C7.7 220.25 12.5 224 18.01 224h20.07C24.65 235.73 16 252.78 16 272v48c0 16.12 6.16 30.67 16 41.93V416c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-32h256v32c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-54.07c9.84-11.25 16-25.8 16-41.93v-48c0-19.22-8.65-36.27-22.07-48H494c5.51 0 10.31-3.75 11.64-9.09l6-24c1.89-7.57-3.84-14.91-11.65-14.91z" />
                </svg>
              </div>
              <span className="text-white font-semibold">CarGo</span>
            </div>
            <p className="text-sm">&copy; {new Date().getFullYear()} CarGo. All rights reserved.</p>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
