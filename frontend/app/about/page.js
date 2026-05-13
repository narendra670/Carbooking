"use client"

import Image from "next/image"
import Link from "next/link"

const images = [
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80",
  "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80",
  "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80",
  "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80",
  "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80",
  "https://images.unsplash.com/photo-1504215680853-026ed3a45a5b?w=800&q=80",
  "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80",
  "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=800&q=80",
  "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80",
  "https://images.unsplash.com/photo-1554744511-5d294d3c9e8f?w=800&q=80",
  "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=800&q=80",
  "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80",
]

const milestones = [
  { year: "2018", title: "Founded", desc: "CarGo was established with a vision to revolutionize car rentals." },
  { year: "2019", title: "500 Cars", desc: "Expanded fleet to 500+ premium vehicles across the city." },
  { year: "2021", title: "10K Customers", desc: "Reached 10,000 happy customers milestone." },
  { year: "2023", title: "National Reach", desc: "Expanded operations to 20+ cities nationwide." },
  { year: "2025", title: "50K+ Rides", desc: "Completed 50,000+ successful bookings." },
]

const values = [
  {
    title: "Quality Fleet",
    desc: "Every vehicle undergoes rigorous inspection and maintenance to ensure peak performance and safety.",
    icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    title: "Transparent Pricing",
    desc: "No hidden fees, no surprises. What you see is exactly what you pay.",
    icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    title: "24/7 Support",
    desc: "Our dedicated team is available around the clock to assist you with any queries or issues.",
    icon: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    title: "Easy Booking",
    desc: "Book your perfect car in minutes with our seamless online platform.",
    icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  },
]

const team = [
  { name: "Rajesh Kumar", role: "Founder & CEO", image: images[4] },
  { name: "Priya Sharma", role: "Chief Operations Officer", image: images[3] },
  { name: "Amit Verma", role: "Head of Fleet Management", image: images[6] },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-dark-50">
      <section className="bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900 text-white py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image src={images[0]} alt="" fill className="object-cover opacity-10" unoptimized />
          <div className="absolute inset-0 bg-gradient-to-r from-dark-900/95 via-dark-900/80 to-dark-900/60" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-300">CarGo</span>
          </h1>
          <p className="text-dark-300 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
            We are on a mission to make premium car rental accessible, transparent, and effortless for everyone.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <span className="inline-block bg-primary-100 text-primary-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
                Our Story
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-dark-900 mb-6">
                Driving Excellence Since 2018
              </h2>
              <div className="space-y-4 text-dark-500 leading-relaxed">
                <p>
                  CarGo started with a simple idea: renting a car should be as easy as ordering a meal. 
                  Founded in 2018, we have grown from a small fleet of 10 cars to one of the most trusted 
                  car rental platforms in the country.
                </p>
                <p>
                  We partner with top automotive brands like Mercedes, BMW, Audi, Porsche, and Ferrari 
                  to bring you the finest selection of vehicles. Every car in our fleet undergoes 
                  rigorous quality checks to ensure your safety and comfort.
                </p>
                <p>
                  With 50,000+ successful bookings and counting, our commitment to excellence has made 
                  us the preferred choice for business travelers, vacationers, and car enthusiasts alike.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative h-48 rounded-2xl overflow-hidden shadow-lg">
                <Image src={images[1]} alt="Luxury car" fill className="object-cover hover:scale-105 transition-transform duration-500" unoptimized />
              </div>
              <div className="relative h-48 rounded-2xl overflow-hidden shadow-lg mt-8">
                <Image src={images[2]} alt="Sports car" fill className="object-cover hover:scale-105 transition-transform duration-500" unoptimized />
              </div>
              <div className="relative h-48 rounded-2xl overflow-hidden shadow-lg">
                <Image src={images[10]} alt="SUV" fill className="object-cover hover:scale-105 transition-transform duration-500" unoptimized />
              </div>
              <div className="relative h-48 rounded-2xl overflow-hidden shadow-lg mt-8">
                <Image src={images[11]} alt="Luxury SUV" fill className="object-cover hover:scale-105 transition-transform duration-500" unoptimized />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-dark-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block bg-primary-100 text-primary-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              Milestones
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-dark-900">Our Journey</h2>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 -translate-x-px h-full w-0.5 bg-primary-200 hidden md:block" />
            <div className="space-y-8 md:space-y-12">
              {milestones.map((m, i) => (
                <div key={i} className={`relative flex items-center gap-6 md:gap-8 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                  <div className={`flex-1 ${i % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                      <span className="text-primary-600 font-bold text-sm">{m.year}</span>
                      <h3 className="text-xl font-bold text-dark-900 mt-1">{m.title}</h3>
                      <p className="text-dark-500 mt-2">{m.desc}</p>
                    </div>
                  </div>
                  <div className="hidden md:flex w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full items-center justify-center text-white font-bold text-sm shadow-lg z-10 flex-shrink-0">
                    {m.year}
                  </div>
                  <div className="flex-1 hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block bg-primary-100 text-primary-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              Why Choose Us
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-dark-900">Our Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {values.map((v, i) => (
              <div key={i} className="bg-dark-50 rounded-2xl p-6 text-center hover:bg-primary-50 hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={v.icon} />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-dark-900 mb-2">{v.title}</h3>
                <p className="text-dark-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-dark-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block bg-primary-100 text-primary-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              Gallery
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-dark-900">Our Premium Fleet</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.slice(0, 8).map((src, i) => (
              <div key={i} className="relative h-48 rounded-xl overflow-hidden shadow-md group cursor-pointer">
                <Image src={src} alt={`Car ${i + 1}`} fill className="object-cover group-hover:scale-110 transition-transform duration-500" unoptimized />
                <div className="absolute inset-0 bg-dark-900/0 group-hover:bg-dark-900/30 transition-colors" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block bg-primary-100 text-primary-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              Our Team
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-dark-900">Meet the Leaders</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {team.map((member, i) => (
              <div key={i} className="text-center group">
                <div className="relative w-40 h-40 rounded-full overflow-hidden mx-auto mb-4 ring-4 ring-primary-100 group-hover:ring-primary-300 transition-all">
                  <Image src={member.image} alt={member.name} fill className="object-cover" unoptimized />
                </div>
                <h3 className="text-lg font-bold text-dark-900">{member.name}</h3>
                <p className="text-primary-600 text-sm font-medium">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.05),transparent_50%)]" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Experience the CarGo Difference?</h2>
          <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers and book your premium car today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/cars" className="bg-white text-primary-600 hover:bg-dark-50 font-semibold py-4 px-10 rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 text-lg">
              Browse Our Fleet
            </Link>
            <Link href="/contact" className="border-2 border-white text-white hover:bg-white/10 font-semibold py-4 px-10 rounded-xl transition-all duration-300 hover:-translate-y-0.5 text-lg">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
