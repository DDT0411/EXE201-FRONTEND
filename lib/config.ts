export const config = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "https://huyrepo.onrender.com/api",
  googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  imageUrlPrefix: process.env.NEXT_PUBLIC_IMAGE_URL_PREFIX || "https://localhost:7091/",
}

export default config
