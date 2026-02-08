// src/lib/endpoints.ts
export const endpoints = {
  auth: {
    login: "/api/auth/login",
    register: "/api/auth/register",
    me: "/api/auth/me",
    logout: "/api/auth/logout",
  },
  services: {
    list: "/api/services",
  },
  employees: {
    list: "/api/employees",
  },
  shifts: {
    list: "/api/shifts",
  },
  bookings: {
    list: "/api/bookings",
    create: "/api/bookings",
    update: (id: string) => `/api/bookings/${id}`,
    cancel: (id: string) => `/api/bookings/${id}/cancel`,
  },
} as const;