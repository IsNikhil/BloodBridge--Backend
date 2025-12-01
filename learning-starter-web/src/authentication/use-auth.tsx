import { createContext, useContext, useState } from "react";
import { useAsyncRetry, useAsyncFn } from "react-use";
import { ApiResponse, ApiError, UserDto } from "../constants/types";
import { StatusCodes } from "../constants/status-codes";
import api from "../config/axios";

const currentUser = "currentUser";

const setUserItem = (user: UserDto) => {
  sessionStorage.setItem(currentUser, JSON.stringify(mapUser(user)));
};

const removeUserItem = () => {
  sessionStorage.removeItem(currentUser);
};

type AuthState = {
  user: UserDto | null;
  errors: ApiError[];
  loading: boolean;
  refetchUser: () => void;
  logout: () => void;
};

const INITIAL_STATE: AuthState = {
  user: null,
  errors: [],
  loading: true,
  refetchUser: undefined as any,
  logout: undefined as any,
};

export const AuthContext = createContext<AuthState>(INITIAL_STATE);

export const AuthProvider = (props: any) => {
  const [errors, setErrors] = useState<ApiError[]>([]);
  const [user, setUser] = useState<UserDto | null>(null);

  const fetchCurrentUser = useAsyncRetry(async () => {
    setErrors([]);

    const response = await api.get<ApiResponse<UserDto>>("/api/get-current-user");

    if (!response.data.hasErrors) {
      setUser(response.data.data);
      if (response.data.data) setUserItem(response.data.data);
    }

    setErrors(response.data.errors);
    return response.data;
  }, []);

  const [, logoutUser] = useAsyncFn(async () => {
    setErrors([]);

    const response = await api.post(`/api/logout`);

    if (response.status === StatusCodes.OK) {
      removeUserItem();
      setUser(null);
    }

    return response;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        errors,
        loading: fetchCurrentUser.loading,
        refetchUser: fetchCurrentUser.retry,
        logout: logoutUser,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthState {
  return useContext(AuthContext);
}

export function useUser(): UserDto {
  const { user } = useContext(AuthContext);
  if (!user) throw new Error(`useUser must be used inside AuthProvider`);
  return user;
}

export const mapUser = (user: any): UserDto => ({
  id: user.id,
  firstName: user.firstName,
  lastName: user.lastName,
  userName: user.userName,
  email: user.email,
  phoneNumber: user.phoneNumber,
  address: user.address,
  dateOfBirth: user.dateOfBirth,
  gender: user.gender,
  userType: user.userType,
  bloodType: user.bloodType,
  createDate: user.createDate,
  updateDate: user.updateDate,
  lastDonationDate: user.lastDonationDate,

  // ⭐ CRITICAL FOR ADMIN GUARD
  role: user.role,
});
