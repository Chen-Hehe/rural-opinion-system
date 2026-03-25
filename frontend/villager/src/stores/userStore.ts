import { ref } from 'vue'
import { defineStore } from 'pinia'
import request from '@/utils/request'

interface UserInfo {
  _id?: string | number
  id?: string | number
  username: string
  role: string
  name: string
  [key: string]: unknown
}

interface LoginPayload {
  username: string
  password: string
  role?: string
  userType?: string
}

interface RegisterPayload {
  username: string
  password: string
  name: string
  phone: string
  address: string
  role?: string
  userType?: string
}

const TOKEN_STORAGE_KEY = 'token'
const USER_INFO_STORAGE_KEY = 'userInfo'

function getInitialUserInfo() {
  const raw = localStorage.getItem(USER_INFO_STORAGE_KEY)

  if (!raw) return null

  try {
    return JSON.parse(raw) as UserInfo
  } catch {
    return null
  }
}

export const useUserStore = defineStore('userStore', () => {
  const token = ref(localStorage.getItem(TOKEN_STORAGE_KEY) || '')
  const userInfo = ref<UserInfo | null>(getInitialUserInfo())

  function setToken(value: string) {
    token.value = value
    if (value) {
      localStorage.setItem(TOKEN_STORAGE_KEY, value)
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY)
    }
  }

  function setUserInfo(value: UserInfo | null) {
    userInfo.value = value
    if (value) {
      localStorage.setItem(USER_INFO_STORAGE_KEY, JSON.stringify(value))
    } else {
      localStorage.removeItem(USER_INFO_STORAGE_KEY)
    }
  }

  async function login(payload: LoginPayload) {
    const result = await request.post('/auth/login', payload)
    setToken(result.token || '')
    setUserInfo(result.user || null)
    return result
  }

  async function register(payload: RegisterPayload) {
    const result = await request.post('/auth/register', payload)
    return result
  }

  function logout() {
    setToken('')
    setUserInfo(null)
  }

  return {
    token,
    userInfo,
    setToken,
    setUserInfo,
    login,
    register,
    logout,
  }
})
