import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  register,
  loginUser,
  verifyOtp,
  logoutUser,
} from "@/api/axios";

type VerifyOtpPayload = {
  name: string;
  email: string;
  password: string;
  role: "admin" | "customer";
  otp: string;
};

type AuthContextType = {
  user: any;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  verifyUserOtp: (data: VerifyOtpPayload) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);

  /* =========================
     RESTORE AUTH ON REFRESH
  ========================= */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  /* =========================
     AUTH = TOKEN BASED
  ========================= */
  const isAuthenticated = !!localStorage.getItem("token");

  /* ========================= LOGIN ========================= */
  const login = async (email: string, password: string) => {
    
    const res = await loginUser({ email, password });
    console.log("Login response:", res);

    if (!res.success) {
      throw new Error(res.message || "Login failed");
    }

    // 🔥 SAVE TOKEN + USER
    localStorage.setItem("token", res.data.accessToken);
    console.log(res.data.accessToken)
    localStorage.setItem("user", JSON.stringify(res.data.user));
    setUser(res.data.user);
  };

  /* ========================= SIGNUP ========================= */
  const signup = async (name: string, email: string, password: string) => {
    const res = await register({
      name,
      email,
      password,
      role: "customer",
    });

    if (!res.success) {
      throw new Error(res.message || "Signup failed");
    }
  };

  /* ========================= VERIFY OTP ========================= */
  const verifyUserOtp = async (data: VerifyOtpPayload) => {
    const res = await verifyOtp(data);

    if (!res.success) {
      throw new Error(res.message || "OTP verification failed");
    }
  };

  /* ========================= LOGOUT ========================= */
  const logout = async () => {
    await logoutUser();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        signup,
        verifyUserOtp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

// import { createContext, useContext, useState, ReactNode } from "react";
// import {
//   register,
//   loginUser,
//   verifyOtp,
//   logoutUser,
// } from "@/api/axios";

// type AuthContextType = {
//   user: any;
//   isAuthenticated: boolean;
//   login: (email: string, password: string) => Promise<void>;
//   signup: (name: string, email: string, password: string) => Promise<void>;
//   verifyUserOtp: (email: string, otp: string) => Promise<void>;
//   logout: () => Promise<void>;
// };

// const AuthContext = createContext<AuthContextType | null>(null);

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<any>(null);

//   const isAuthenticated = !!user;

//   /* =========================
//      LOGIN
//   ========================= */
//   const login = async (email: string, password: string) => {
//     const res = await loginUser({ email, password });

//     // ✅ FIXED HERE
//     if (res.success) {
//       setUser(res.data); 
//     } else {
//       throw new Error(res.message || "Login failed");
//     }
//   };

//   /* =========================
//      SIGNUP
//   ========================= */
//   const signup = async (
//     name: string,
//     email: string,
//     password: string
//   ) => {
//     const res = await register({
//       name,
//       email,
//       password,
//       role: "customer",
//     });

//     if (!res.success) {
//       throw new Error(res.message || "Signup failed");
//     }
//   };

//   /* =========================
//      VERIFY OTP
//   ========================= */
//   const verifyUserOtp = async (email: string, otp: string) => {
//     const res = await verifyOtp({
//       email,
//       otp,
//     });

//     if (!res.success) {
//       throw new Error(res.message || "OTP verification failed");
//     }
//   };

//   /* =========================
//      LOGOUT
//   ========================= */
//   const logout = async () => {
//     await logoutUser();
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         isAuthenticated,
//         login,
//         signup,
//         verifyUserOtp,
//         logout,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error("useAuth must be used within AuthProvider");
//   return context;
// };

// import { createContext, useContext, useState, ReactNode } from "react";

// type User = { email: string; name: string };

// type AuthContextType = {
//   user: User | null;
//   login: (email: string, password: string) => boolean;
//   signup: (name: string, email: string, password: string) => boolean;
//   logout: () => void;
//   isAuthenticated: boolean;
// };

// const AuthContext = createContext<AuthContextType | null>(null);

// export const useAuth = () => {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be used within AuthProvider");
//   return ctx;
// };

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<User | null>(() => {
//     const saved = localStorage.getItem("freshcart_user");
//     return saved ? JSON.parse(saved) : null;
//   });

//   const login = (email: string, _password: string) => {
//     const u = { email, name: email.split("@")[0] };
//     setUser(u);
//     localStorage.setItem("freshcart_user", JSON.stringify(u));
//     return true;
//   };

//   const signup = (name: string, email: string, _password: string) => {
//     const u = { email, name };
//     setUser(u);
//     localStorage.setItem("freshcart_user", JSON.stringify(u));
//     return true;
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem("freshcart_user");
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
