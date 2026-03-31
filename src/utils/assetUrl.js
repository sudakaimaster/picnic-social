const base = import.meta.env.BASE_URL
export const asset = (path) => `${base}${path.startsWith('/') ? path.slice(1) : path}`
