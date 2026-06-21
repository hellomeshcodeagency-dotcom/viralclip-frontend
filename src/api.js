import axios from 'axios'

const BASE_URL = 'https://viralclip-backend-clws.onrender.com'

function getShop() {
  const urlParams = new URLSearchParams(window.location.search)
  const shopFromUrl = urlParams.get('shop')
  if (shopFromUrl) {
    localStorage.setItem('vc_shop', shopFromUrl)
    return shopFromUrl
  }
  return localStorage.getItem('vc_shop') || ''
}

const api = axios.create({ baseURL: BASE_URL })

api.interceptors.request.use(config => {
  const shop = getShop()
  console.log('Sending request with shop:', shop)
  if (shop) config.headers['x-shop'] = shop
  return config
})

export default api

export { getShop }
