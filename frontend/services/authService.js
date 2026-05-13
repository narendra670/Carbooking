import axios from "./axios"

const authService = {
  login: async (data) => (await axios.post("/auth/login", data)).data,
  register: async (data) => (await axios.post("/auth/register", data)).data,
  getMe: async () => (await axios.get("/auth/me")).data,
}

export default authService
