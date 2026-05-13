import axios from "./axios"

const bookingService = {
  getAll: async (params = {}) => (await axios.get("/bookings", { params })).data,
  getById: async (id) => (await axios.get(`/bookings/${id}`)).data,
  create: async (data) => (await axios.post("/bookings", data)).data,
  cancel: async (id) => (await axios.put(`/bookings/${id}/cancel`)).data,
  updateStatus: async (id, data) => (await axios.put(`/bookings/${id}/status`, data)).data,
  getStats: async () => (await axios.get("/bookings/stats")).data,
}

export default bookingService
