import { defineStore } from 'pinia'

interface UserInfo {
  id: string | number
  username: string
  role: string
  name: string
  [key: string]: unknown
}

interface UserState {
  token: string
  userInfo: UserInfo | null
}

const USER_STORAGE_KEY = 'admin-user-store'

function getInitialState(): UserState {
  const raw = localStorage.getItem(USER_STORAGE_KEY)

  if (!raw) {
    return {
      token: '',
      userInfo: null,
    }
  }

  try {
    const parsed = JSON.parse(raw) as UserState
    return {
      token: parsed.token || '',
      userInfo: parsed.userInfo || null,
    }
  } catch {
    return {
      token: '',
      userInfo: null,
    }
  }
}

export const useUserStore = defineStore('user', {
  state: (): UserState => getInitialState(),
  actions: {
    setToken(token: string) {
      this.token = token
      this.persist()
    },
    setUserInfo(userInfo: UserInfo) {
      this.userInfo = userInfo
      this.persist()
    },
    logout() {
      this.token = ''
      this.userInfo = null
      localStorage.removeItem(USER_STORAGE_KEY)
    },
    persist() {
      localStorage.setItem(
        USER_STORAGE_KEY,
        JSON.stringify({
          token: this.token,
          userInfo: this.userInfo,
        }),
      )
    },
  },
})
