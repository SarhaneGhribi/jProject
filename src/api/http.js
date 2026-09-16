import axios from "axios"

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000"

const http = axios.create({ baseURL: API_URL })

http.interceptors.request.use((config) => {
    const token = localStorage.getItem("token")
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

export default http
