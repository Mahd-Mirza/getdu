"use client"

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

export const ADMIN_EMAIL = "admin@getdu.com"
export const ADMIN_PASSWORD = "admin@getdu"

const STORAGE_KEY = "getdu-admin-auth"

type AuthState = {
  isAuthenticated: boolean
  _hasHydrated: boolean
  setHasHydrated: (v: boolean) => void
  login: (email: string, password: string) => boolean
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      _hasHydrated: false,
      setHasHydrated: (v) => set({ _hasHydrated: v }),
      login: (email, password) => {
        const ok =
          email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() &&
          password === ADMIN_PASSWORD
        if (ok) set({ isAuthenticated: true })
        return ok
      },
      logout: () => set({ isAuthenticated: false }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => sessionStorage),
      partialize: (s) => ({ isAuthenticated: s.isAuthenticated }),
      onRehydrateStorage: () => () => {
        queueMicrotask(() => useAuthStore.getState().setHasHydrated(true))
      },
    },
  ),
)
