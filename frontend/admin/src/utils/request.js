import axios from 'axios'
import router from '../router'
import { useUserStore } from '../stores/userStore'

const request = axios.create({
  baseURL: '/api',
})

request.interceptors.request.use(
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

request.interceptors.response.use(
  (response) => {
    const userStore = useUserStore()
    const result = response.data

    if (result?.code === 401) {
      userStore.logout()
      router.push('/login')
      return Promise.reject(result)
    }

    return result
  },
  (error) => {
    const userStore = useUserStore()

    if (error?.response?.status === 401) {
      userStore.logout()
      router.push('/login')
    }

    return Promise.reject(error)
  },
)

export default request
