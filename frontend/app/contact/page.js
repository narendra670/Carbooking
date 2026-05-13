"use client"

import { useState } from "react"
import { BiSend, BiMap, BiPhone, BiEnvelope, BiMessageDetail, BiUser, BiCheckCircle } from "react-icons/bi"
import { HiOutlineMail, HiOutlinePhone } from "react-icons/hi"
import toast from "react-hot-toast"
import contactService from "@/services/contactService"

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await contactService.send(form)
      toast.success(res.message || "Message sent successfully!")
      setSent(true)
      setForm({ name: "", email: "", phone: "", subject: "", message: "" })
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send message. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const contactInfo = [
    { icon: BiMap, label: "Visit Us", value: "123 Car Street, Auto City, AC 10001" },
    { icon: HiOutlinePhone, label: "Call Us", value: "+1 (555) 123-4567" },
    { icon: HiOutlineMail, label: "Email Us", value: "support@cargo.com" },
  ]

  return (
    <div className="min-h-screen bg-dark-50">
      <div className="bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900 text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Get In Touch</h1>
          <p className="text-dark-300 text-lg max-w-2xl mx-auto">
            Have a question, feedback, or need help? We&apos;d love to hear from you.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 -mt-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                  <BiMessageDetail className="w-5 h-5 text-primary-600" />
                </div>
                <h2 className="text-xl font-bold text-dark-900">Send us a Message</h2>
              </div>

              {sent ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <BiCheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-dark-900 mb-2">Message Sent!</h3>
                  <p className="text-dark-500 mb-6">Thank you for reaching out. We&apos;ll get back to you shortly.</p>
                  <button onClick={() => setSent(false)} className="btn-primary">
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-dark-700 mb-1.5">Full Name *</label>
                      <div className="relative">
                        <BiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                        <input
                          type="text"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          required
                          placeholder="John Doe"
                          className="input-field pl-11"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-dark-700 mb-1.5">Email *</label>
                      <div className="relative">
                        <BiEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          required
                          placeholder="john@example.com"
                          className="input-field pl-11"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-dark-700 mb-1.5">Phone (Optional)</label>
                      <div className="relative">
                        <BiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="+1 (555) 000-0000"
                          className="input-field pl-11"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-dark-700 mb-1.5">Subject *</label>
                      <div className="relative">
                        <BiMessageDetail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                        <input
                          type="text"
                          name="subject"
                          value={form.subject}
                          onChange={handleChange}
                          required
                          placeholder="How can we help?"
                          className="input-field pl-11"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-1.5">Message *</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="Tell us more about your inquiry..."
                      className="input-field resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      <>
                        <BiSend className="w-5 h-5" /> Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {contactInfo.map((item, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center text-white shadow-lg mb-4">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-dark-900 mb-1">{item.label}</h3>
                <p className="text-dark-500 text-sm">{item.value}</p>
              </div>
            ))}

            <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="font-bold text-lg mb-2">Business Hours</h3>
              <div className="space-y-2 text-sm text-primary-100">
                <div className="flex justify-between">
                  <span>Mon - Fri</span>
                  <span className="font-medium text-white">9:00 AM - 8:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span className="font-medium text-white">10:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="font-medium text-white">Closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
