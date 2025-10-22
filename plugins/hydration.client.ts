export default defineNuxtPlugin(() => {
    // Fix hydration mismatch issues
    if (process.client) {
        // Wait for the DOM to be fully loaded before mounting
        window.addEventListener('load', () => {
            // Remove any server-side rendered hydration markers
            const serverRenderedElements = document.querySelectorAll('[data-server-rendered="true"]')
            serverRenderedElements.forEach(el => {
                el.removeAttribute('data-server-rendered')
            })
        })
    }
})