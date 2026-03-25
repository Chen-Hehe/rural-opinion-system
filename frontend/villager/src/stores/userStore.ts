import { defineStore } from 'pinia'

interface UserState {
  token: string
  username: string
  role: string
}

const USER_STORAGE_KEY = 'villager-user'

function getInitialState(): UserState {
  const raw = localStorage.getItem(USER_STORAGE_KEY)

  if (!raw) {
    return {
      token: '',
      username: '',
      role: '',
    }
  }

  try {
    return JSON.parse(raw) as UserState
  } catch {
    return {
      token: '',
      username: '',
      role: '',
    }
  }
}

export const useUserStore = defineStore('userStore', {
  state: (): UserState => getInitialState(),
  actions: {
    setUser(payload: UserState) {
      this.token = payload.token
      this.username = payload.username
      this.role = payload.role
      this.persist()
    },
    clearUser() {
      this.token = ''
      this.username = ''
      this.role = ''
      localStorage.removeItem(USER_STORAGE_KEY)
    },
    persist() {
      localStorage.setItem(
        USER_STORAGE_KEY,
        JSON.stringify({
          token: this.token,
          username: this.username,
          role: this.role,
        }),
      )
    },
  },
})
