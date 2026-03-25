import axios from 'axios'
import router from '@/router'
import { useUserStore } from '@/stores/userStore'

const service = axios.create({
  baseURL: '/api',
})

service.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()

    if (userStore.token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${userStore.token}`
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
