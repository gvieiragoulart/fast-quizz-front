import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import { env } from "@/config/env"
import { App } from "@/App"
import "./index.css"

async function enableMocking() {
    if (env.VITE_MOCK !== "development") {
        return
    }
    const { worker } = await import("./mocks/browser.ts")
    return worker.start()
}

enableMocking().then(() => {
    createRoot(document.getElementById("root")!).render(
        <StrictMode>
            <App />
        </StrictMode>,
    )
})
