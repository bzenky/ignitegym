import axios from 'axios'

const api = axios.create({
  baseURL: 'http://192.168.100.9:3333'
})

// api.interceptors.request.use((config) => {
//   return config
// }, (error) => {
//   return Promise.reject(error)
// })

// api.interceptors.request.use((response) => {
//   return response
// }, (error) => {
//   return Promise.reject(error)
// })

export { api }