import axios from "axios";
import { API_URL, axiosInstance } from "../config/Api";
import { UserProfile, useUserStore } from "../store/UserStore";
import { jwtDecode } from "jwt-decode";

// interface DecodedRoleToken {
//   role: string;
// }
export interface DecodedIdToken {
  user_id: number;
}

export interface ProfileUpdateRequest {
  first_name: string;
  last_name: string;
  password: string;
}
export interface Profile {
  user_id: number;
  username: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  is_staff: boolean;
  date_joined: string;
}
export const registerUser = async (
  username: string,
  password: string,
  // age: number,
  name: string,
  surname: string
) => {
  const response = await axiosInstance.post(`${API_URL}/register/`, {
    username,
    password,
    // age,
    // name,
    // surname,
  });
  const { access, refresh } = response.data;
  const decoded: DecodedIdToken = jwtDecode(access);
  const id = decoded.user_id;
  localStorage.setItem("access_token", access);
  localStorage.setItem("refresh_token", refresh);
  updateUser({ first_name: name, last_name: surname, password: password });
  const profile = getProfile(id);
  // const setUser = useUserStore.getState().signIn;
  // setUser(await profile /* "user" */);
  useUserStore.getState().setIsAuthenticated(true);
  axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${access}`;
  return profile;
};

export const loginUser = async (username: string, password: string) => {
  const response = await axiosInstance.post(`${API_URL}/login/`, {
    username: username,
    password,
  });
  const { access, refresh } = response.data;
  const decodedId: DecodedIdToken = jwtDecode(access);
  const id = decodedId.user_id;
  localStorage.setItem("access_token", access);
  localStorage.setItem("refresh_token", refresh);
  const profile = getProfile(id);
  // const setUser = useUserStore.getState().signIn;
  // setUser(await profile);
  useUserStore.getState().setIsAuthenticated(true);
  axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${access}`;
  return profile;
};

export const getProfile = async (id: number) => {
  const response = await axiosInstance.get(`${API_URL}/users/${id}/`);
  const profile = response.data;
  useUserStore.getState().setUserProfile(profile);
  return profile;
};
export const getProfileFromJwt = async (): Promise<UserProfile | null> => {
  const jwt = localStorage.getItem("access_token");
  if (jwt) {
    const decodedId: DecodedIdToken = jwtDecode(jwt);
    const id = decodedId.user_id;
    const response = await getProfile(id);
    const profile = response.data;
    const { setUserProfile } = useUserStore.getState();
    setUserProfile(profile);
    return profile;
  } else {
    return null;
  }
};
export const getId = () => {
  const jwt = localStorage.getItem("access_token");
  if (jwt) {
    const decodedId: DecodedIdToken = jwtDecode(jwt);
    const id = decodedId.user_id;
    return id;
  }
  return null;
};
export const updateUser = async (
  profileUpdateRequest: ProfileUpdateRequest
) => {
  const user_id = getId();
  const response = await axiosInstance.patch(
    `${API_URL}/users/${user_id}/update_profile/`,
    profileUpdateRequest
  );
  const profile = response.data;
  getProfile(profile.user_id);
  return profile;
};
export const refreshToken = async () => {
  const response = await axiosInstance.post(`${API_URL}/token/refresh/`, {
    refresh: localStorage.getItem("refresh_token"),
  });
  const { access } = response.data;
  localStorage.setItem("access_token", access);
  return access;
};

axiosInstance.interceptors.response.use(
  (response) => response, // Directly return successful responses.
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark the request as retried to avoid infinite loops.
      try {
        refreshToken();
        const accessToken = localStorage.getItem("access_token");
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest); // Retry the original request with the new access token.
      } catch (refreshError) {
        // Handle refresh token errors by clearing stored tokens and redirecting to the login page.
        console.error("Token refresh failed:", refreshError);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error); // For all other errors, return the error as is.
  }
);
