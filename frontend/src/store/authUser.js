import axios from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  isSigningUp: false,
  isCheckingAuth: true,
  isLogginOut: false,
  isLogginIn: false,
  signup: async (credentials) => {
    set({ isSigningUp: true });
    try {
      const response = await axios.post("/api/v1/auth/signup", credentials);
      set({ user: response.data.user, isSigningUp: false });
      toast.success(response.data.message || "Account created successfully.");
    } catch (error) {
      toast.error(
        error.response.data.message ||
          "An error occurred. Please try again later."
      );
      set({ isSigningUp: false, user: null });
    }
  },
  login: async (credentials) => {
    set({ isLogginIn: true });
    try {
        const response = await axios.post("/api/v1/auth/login", credentials);
        set({ user: response.data.user, isLogginIn: false });
        toast.success(response.data.message || "Logged in successfully.");
    } catch (error) {
        set({ isLogginIn: false, user: null });
        toast.error(
          error.response?.data?.message ||
            "An error occurred. Please try again later."
        );
    }
  },
  logout: async () => {
    set({ isLogginOut: true });
    try {
      await axios.post("/api/v1/auth/logout");
      set({ user: null, isLogginOut: false });
      toast.success("Logged out successfully.");
    } catch (error) {
      set({ isLogginOut: false });
      toast.error(
        error.response?.data?.message ||
          "An error occurred. Please try again later."
      );
    }
  },
  authCheck: async () => {
    set({ isCheckingAuth: true });
    try {
      const response = await axios.get("/api/v1/auth/authCheck");
      set({ user: response.data.user, isCheckingAuth: false });
    } catch (error) {
      set({ user: null, isCheckingAuth: false });
      // toast.error(error.response?.data?.message || "An error occurred. Please try again later.");
    }
  },
}));
