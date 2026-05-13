import axios from "./axios"

const contactService = {
  send: async (data) => (await axios.post("/contact", data)).data,
  getAll: async () => (await axios.get("/contact")).data,
  markAsRead: async (id) => (await axios.put(`/contact/${id}/read`)).data,
  delete: async (id) => (await axios.delete(`/contact/${id}`)).data,
}

export default contactService
