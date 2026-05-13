import axios from "./axios"

const carService = {
  getAll: async (params = {}) => (await axios.get("/cars", { params })).data,
  getById: async (id) => (await axios.get(`/cars/${id}`)).data,
  getBrands: async () => (await axios.get("/cars/brands")).data,
  checkAvailability: async (id, params) =>
    (await axios.get(`/cars/${id}/availability`, { params })).data,
  create: async (data) => (await axios.post("/cars", data)).data,
  update: async (id, data) => (await axios.put(`/cars/${id}`, data)).data,
  delete: async (id) => (await axios.delete(`/cars/${id}`)).data,
}

export default carService
