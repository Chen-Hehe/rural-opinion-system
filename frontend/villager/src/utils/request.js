import axios from 'axios'
import router from '@/router'
import { useUserStore } from '@/stores/userStore'

const TOKEN_STORAGE_KEY = 'token'
const LEGACY_USER_STORAGE_KEY = 'villager-user'

const service = axios.create({
  baseURL: '/api',
})

service.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem(TOKEN_STORAGE_KEY)

    if (!token) {
      const legacyRaw = localStorage.getItem(LEGACY_USER_STORAGE_KEY)
      if (legacyRaw) {
        try {
          const legacyData = JSON.parse(legacyRaw)
          token = legacyData?.token || ''
        } catch {
          token = ''
        }
      }
    }

    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error),
)

service.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error?.response?.status

    if (status === 401) {
      const userStore = useUserStore()
      userStore.logout()
      router.push('/login')
    }

    return Promise.reject(error)
  },
)

export default service
