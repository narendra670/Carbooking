"use client"

import { createContext, useContext, useState, useEffect } from "react"
import axios from "@/services/axios"
import { useRouter } from "next/navigation"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
      axios
        .get("/auth/me")
        .then((res) => setUser(res.data))
        .catch(() => {
          localStorage.removeItem("token")
          delete axios.defaults.headers.common["Authorization"]
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const res = await axios.post("/auth/login", { email, password })
    const { token, user } = res.data
    localStorage.setItem("token", token)
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
    setUser(user)
    return user
  }

  const register = async (data) => {
    const res = await axios.post("/auth/register", data)
    const { token, user } = res.data
    localStorage.setItem("token", token)
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
    setUser(user)
    return user
  }

  const logout = () => {
    localStorage.removeItem("token")
    delete axios.defaults.headers.common["Authorization"]
    setUser(null)
    router.push("/")
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}
