import axios from "axios"

import { env } from "@/config/env"

const API_BASE_URL =
    env.VITE_ENVIRONMENT === "development"
        ? env.VITE_API_DEV_BASE_URL
        : env.VITE_API_BASE_URL

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token")
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export { api, API_BASE_URL }
