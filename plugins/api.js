import axios from 'axios'

let apiUrl = process.env.API_URL
if (process.env.NODE_ENV === 'development') {
  apiUrl = process.env.API_URL_DEV
}
const api = axios.create({
  baseURL: apiUrl
})
export default api
