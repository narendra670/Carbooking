"use client"

import Link from "next/link"
import Image from "next/image"

const cars = [
  {
    id: 1,
    name: "Mercedes-Benz S-Class",
    brand: "Mercedes",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80",
    seats: 5,
    fuel: "Petrol",
    transmission: "Automatic",
    price: 8500,
    type: "Luxury Sedan",
  },
  {
    id: 2,
    name: "Ferrari F8 Tributo",
    brand: "Ferrari",
    image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80",
    seats: 2,
    fuel: "Petrol",
    transmission: "Automatic",
    price: 25000,
    type: "Sports Car",
  },
  {
    id: 3,
    name: "Range Rover Velar",
    brand: "Land Rover",
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80",
    seats: 5,
    fuel: "Diesel",
    transmission: "Automatic",
    price: 12000,
    type: "SUV",
  },
  {
    id: 4,
    name: "Porsche 911 Carrera",
    brand: "Porsche",
    image: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=800&q=80",
    seats: 4,
    fuel: "Petrol",
    transmission: "Automatic",
    price: 18000,
    type: "Sports Car",
  },
  {
    id: 5,
    name: "BMW 7 Series",
    brand: "BMW",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80",
    seats: 5,
    fuel: "Petrol",
    transmission: "Automatic",
    price: 9500,
    type: "Luxury Sedan",
  },
  {
    id: 6,
    name: "Lamborghini Huracán",
    brand: "Lamborghini",
    image: "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=800&q=80",
    seats: 2,
    fuel: "Petrol",
    transmission: "Automatic",
    price: 30000,
    type: "Sports Car",
  },
  {
    id: 7,
    name: "Audi Q8",
    brand: "Audi",
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80",
    seats: 5,
    fuel: "Diesel",
    transmission: "Automatic",
    price: 11000,
    type: "SUV",
  },
  {
    id: 8,
    name: "Tesla Model S",
    brand: "Tesla",
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80",
    seats: 5,
    fuel: "Electric",
    transmission: "Automatic",
    price: 14000,
    type: "Electric Sedan",
  },
  {
    id: 9,
    name: "Rolls-Royce Ghost",
    brand: "Rolls-Royce",
    image: "https://images.unsplash.com/photo-1631295868223-63265b40d9e4?w=800&q=80",
    seats: 5,
    fuel: "Petrol",
    transmission: "Automatic",
    price: 35000,
    type: "Ultra-Luxury",
  },
]

const brands = [...new Set(cars.map((c) => c.brand))]
const types = [...new Set(cars.map((c) => c.type))]

export default function CarsPage() {
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
        <div className="flex flex-wrap gap-2 mb-8 pb-6 border-b border-dark-200">
          <span className="text-sm font-medium text-dark-500 mr-2 py-2">Filter:</span>
          {brands.map((brand) => (
            <button
              key={brand}
              className="px-3 py-1.5 text-sm font-medium rounded-lg border border-dark-200 text-dark-600 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-600 transition-colors"
            >
              {brand}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {cars.map((car) => (
            <div key={car.id} className="card group">
              <div className="relative h-52 overflow-hidden bg-dark-100">
                <Image
                  src={car.image}
                  alt={car.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  unoptimized
                />
                <div className="absolute top-3 left-3">
                  <span className="badge badge-success">Available</span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="bg-white/90 backdrop-blur-sm text-dark-800 text-xs font-bold px-2.5 py-1 rounded-lg">
                    {car.type}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-dark-900 mb-1">{car.name}</h3>
                <p className="text-sm text-dark-500 mb-3">{car.brand}</p>
                <div className="flex items-center gap-4 mb-4 text-sm text-dark-500">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 640 512"><path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512h388.6c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304h-91.4z"/></svg>
                    {car.seats} Seats
                  </span>
                  <span>{car.fuel}</span>
                  <span>{car.transmission}</span>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-dark-100">
                  <div>
                    <span className="text-2xl font-bold text-primary-600">&#8377;{car.price.toLocaleString()}</span>
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
      </div>
    </div>
  )
}
