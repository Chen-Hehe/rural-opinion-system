import { ref } from 'vue'
import { defineStore } from 'pinia'

interface UserInfo {
  id: string | number
  username: string
  role: string
  name: string
  [key: string]: unknown
}

const USER_STORAGE_KEY = 'villager-user'

function getInitialState() {
  const raw = localStorage.getItem(USER_STORAGE_KEY)

  if (!raw) {
    return {
      token: '',
      userInfo: null as UserInfo | null,
    }
  }

  try {
    const parsed = JSON.parse(raw) as {
      token?: string
      userInfo?: UserInfo | null
    }

    return {
      token: parsed.token ?? '',
      userInfo: parsed.userInfo ?? null,
    }
  } catch {
    return {
      token: '',
      userInfo: null as UserInfo | null,
    }
  }
}

export const useUserStore = defineStore('userStore', () => {
  const initialState = getInitialState()
  const token = ref(initialState.token)
  const userInfo = ref<UserInfo | null>(initialState.userInfo)

  function persist() {
    localStorage.setItem(
      USER_STORAGE_KEY,
      JSON.stringify({
        token: token.value,
        userInfo: userInfo.value,
      }),
    )
  }

  function setToken(value: string) {
    token.value = value
    persist()
  }

  function setUserInfo(value: UserInfo | null) {
    userInfo.value = value
    persist()
  }

  function logout() {
    token.value = ''
    userInfo.value = null
    localStorage.removeItem(USER_STORAGE_KEY)
  }

  return {
    token,
    userInfo,
    setToken,
    setUserInfo,
    logout,
  }
})
