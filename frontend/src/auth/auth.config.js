export const authConfig = {
  providers: {
    google: {
      clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID
    }
  },
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL
};
