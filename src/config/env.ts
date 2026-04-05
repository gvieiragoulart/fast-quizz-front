const env = {
    VITE_ENVIRONMENT: import.meta.env.VITE_ENVIRONMENT as string,
    VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL as string,
    VITE_API_DEV_BASE_URL: import.meta.env.VITE_API_DEV_BASE_URL as string,
    VITE_MOCK: import.meta.env.VITE_MOCK as string,
}

export { env }
