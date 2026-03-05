import React, { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  mockLoadUserProfile,
  mockUpdateUserProfile,
} from "../pages/user/testUser";

// TODO (Backend Developer): Uncomment the line below to use real API calls
// import axios from "axios";

export const AppContext = createContext(null);

const AppContextProvider = ({ children }) => {
  // --- STATE MANAGEMENT ---
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  // --- CONFIGURATION ---
  // TODO (Backend Developer): Replace with your actual backend URL
  const backendUrl = "http://localhost:4000";

  /**
   * Mock registration function.
   * TODO (Backend Developer): Replace this with a real API call to your register endpoint.
   */
  const register = async (name, email, password) => {
    setLoading(true);
    try {
      // --- FRONTEND MOCK ---
      console.log("Attempting mock registration for:", name, email);
      toast.info("محاكاة التسجيل: سيتم تسجيل دخولك الآن.");
      // For mock purposes, registration will just log the user in.
      await login(email, password);
      // --- END FRONTEND MOCK ---

      /*
      // --- BACKEND INTEGRATION (EXAMPLE) ---
      const response = await axios.post(`${backendUrl}/api/user/register`, { name, email, password });
      if (response.data.success) {
        const receivedToken = response.data.token;
        localStorage.setItem("token", receivedToken);
        setToken(receivedToken);
        toast.success("🎉 تم إنشاء الحساب بنجاح");
      } else {
        toast.error(response.data.message);
      }
      */
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("فشل إنشاء الحساب. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };
  // --- AUTHENTICATION LOGIC ---

  /**
   * Mock login function.
   * TODO (Backend Developer): Replace this with a real API call to your login endpoint.
   * The API should return a token on success.
   */
  const login = async (email, password) => {
    setLoading(true);
    try {
      // --- FRONTEND MOCK ---
      console.log("Attempting mock login for:", email);
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulate success
      const mockToken = `mock_token_${Date.now()}`;
      localStorage.setItem("token", mockToken);
      setToken(mockToken);
      toast.success("✅ تم تسجيل الدخول بنجاح (محاكاة)");
      // --- END FRONTEND MOCK ---

      /*
      // --- BACKEND INTEGRATION (EXAMPLE) ---
      const response = await axios.post(`${backendUrl}/api/user/login`, { email, password });
      if (response.data.success) {
        const receivedToken = response.data.token;
        localStorage.setItem("token", receivedToken);
        setToken(receivedToken);
        toast.success("✅ تم تسجيل الدخول بنجاح");
      } else {
        toast.error(response.data.message);
      }
      */
    } catch (error) {
      console.error("Login error:", error);
      toast.error("فشل تسجيل الدخول. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout function. Clears user session.
   */
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUserData(null);
    toast.info("تم تسجيل الخروج");
  };

  // --- USER PROFILE LOGIC ---

  /**
   * Loads user profile data if a token exists.
   * TODO (Backend Developer): Replace mockLoadUserProfile with a real API call.
   */
  const loadUserProfileData = async () => {
    if (token) {
      setLoading(true);
      try {
        // --- FRONTEND MOCK ---
        const data = await mockLoadUserProfile();
        setUserData(data);
        // --- END FRONTEND MOCK ---

        /*
        // --- BACKEND INTEGRATION (EXAMPLE) ---
        const response = await axios.get(`${backendUrl}/api/user/profile`, { headers: { token } });
        if (response.data.success) {
          setUserData(response.data.userData);
        } else {
          // Handle case where token is invalid
          logout();
        }
        */
      } catch (error) {
        console.error("Failed to load user data:", error);
        // If token is invalid, log out the user
        logout();
      } finally {
        setLoading(false);
      }
    }
  };

  /**
   * Updates user profile data.
   * TODO (Backend Developer): Replace mockUpdateUserProfile with a real API call.
   */
  const updateUserProfile = async (formData) => {
    if (!token) return false;
    setLoading(true);
    try {
      // --- FRONTEND MOCK ---
      const success = await mockUpdateUserProfile(formData);
      if (success) {
        // Refresh user data after update
        await loadUserProfileData();
      }
      return success;
      // --- END FRONTEND MOCK ---
    } catch (error) {
      console.error("Failed to update profile:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Effect to load user data whenever the token changes (e.g., on login or app load)
  useEffect(() => {
    if (token) {
      loadUserProfileData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const contextValue = {
    token,
    userData,
    loading,
    backendUrl,
    register,
    login,
    logout,
    loadUserProfileData,
    updateUserProfile,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export default AppContextProvider;