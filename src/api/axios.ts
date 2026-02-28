import axios from "axios";

/* =========================
   BASE API URL
========================= */

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/v1`;

/* =========================
   AXIOS INSTANCE
========================= */

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // keep true if using cookies also
  headers: {
    "Content-Type": "application/json",
  },
});

/* =========================
   REQUEST INTERCEPTOR
   👉 Attach JWT Token Automatically
========================= */

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* =========================
   RESPONSE INTERCEPTOR
   👉 Handle 401 globally
========================= */

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("401 from", error.config.url);
    }
    return Promise.reject(error.response?.data || error.message);
  }
);
/* =========================
   AUTH APIs
========================= */

// 📝 Register
export const register = async (userData: {
  name: string;
  email: string;
  password: string;
  role: "customer";
}) => {
  const res = await axiosInstance.post("/auth/register-request", userData);
  return res.data;
};

// 🔢 Verify OTP
export const verifyOtp = async (data: {
  email: string;
  otp: string;
}) => {
  const res = await axiosInstance.post("/auth/verify-otp", data);
  return res.data;
};

// 🔐 Login
export const loginUser = async (data: {
  email: string;
  password: string;
}) => {
  const res = await axiosInstance.post("/auth/login", data);

  // 🔥 Save token after login
  if (res.data?.token) {
    localStorage.setItem("token", res.data.token);
  }

  return res.data;
};

// 🚪 Logout
export const logoutUser = async () => {
  const res = await axiosInstance.post("/auth/logout");

  // 🔥 Remove token
  localStorage.removeItem("token");

  return res.data;
};

// 🔄 Refresh Token
export const refreshToken = async () => {
  const res = await axiosInstance.post("/auth/refresh");

  if (res.data?.token) {
    localStorage.setItem("token", res.data.accessToken);
  }

  return res.data;
};

/* =========================
   CART APIs
========================= */

// ➕ Add to Cart
export const addToCart = async (data: {
  productId: string;
  quantity: number;
}) => {
  const res = await axiosInstance.post("/cart/add", data);
  return res.data;
};

// ✏️ Update Cart Quantity
export const updateCartQuantity = async (data: {
  productId: string;
  quantity: number;
}) => {
  const res = await axiosInstance.patch("/cart/update", data);
  return res.data;
};

// ❌ Remove Item
export const removeFromCart = async (productId: string) => {
  const res = await axiosInstance.delete(`/cart/remove/${productId}`);
  return res.data;
};

// 👀 Get Cart
export const getCart = async () => {
  const res = await axiosInstance.get("/cart");
  return res.data;
};

/* =========================
   PRODUCT APIs (User View)
========================= */

// 📦 Get All Products
export const getAllProducts = async (params?: {
  page?: number;
  limit?: number;
  category?: string;
  sort?: string;
}) => {
  const res = await axiosInstance.get("/products", { params });
  return res.data;
};

// 🔍 Get Product Details (by slug)
export const getProductDetails = async (slug: string) => {
  const res = await axiosInstance.get(`/products/${slug}`);
  return res.data;
};

/* =========================
   ORDER APIs
========================= */

// 🧾 Place Order
export const placeOrder = async (data: {
  addressId: string;
}) => {
  const res = await axiosInstance.post("/orders", data);
  return res.data;
};

// 📜 Get My Orders
export const getMyOrders = async () => {
  const res = await axiosInstance.get("/orders/my");
  return res.data;
};

// 📍 Track Order
export const trackOrder = async (orderNumber: string) => {
  const res = await axiosInstance.get(`/orders/${orderNumber}`);
  return res.data;
};

/* =========================
   ADDRESS APIs
========================= */

// ➕ Add Address
export const addAddress = async (data: {
  fullName: string;
  phone: string;
  addressLine1: string;
  city: string;
  area: string;
  pincode: string;
  isDefault?: boolean;
}) => {
  const res = await axiosInstance.post("/address", data);
  return res.data;
};

// 📄 Get My Addresses
export const getMyAddresses = async () => {
  const res = await axiosInstance.get("/address");
  return res.data;
};

/* =========================
   CREDIT APIs
========================= */

// 📊 Get Credit Status
export const getCreditStatus = async () => {
  const res = await axiosInstance.get("/users/me/credit");
  return res.data;
};

export default axiosInstance;






// import axios from "axios";

// console.log("VITE_BACKEND_URL:", import.meta.env.VITE_BACKEND_URL);

// // Base API URL
// const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/v1`;

// // Axios instance
// const axiosInstance = axios.create({
//   baseURL: API_URL,
//   withCredentials: true,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// /* =========================
//    AUTH APIs
// ========================= */

// // Register (Customer)
// export const register = async (userData: {
//   name: string;
//   email: string;
//   password: string;
//   role: "customer";
// }) => {
//   try {
//     const res = await axiosInstance.post("/auth/register", userData);
//     return res.data;
//   } catch (error: any) {
//     throw error.response?.data || error.message;
//   }
// };

// /* =========================
//    CART APIs
// ========================= */

// // ➕ Add to Cart
// export const addToCart = async (data: {
//   productId: string;
//   quantity: number;
// }) => {
//   try {
//     const res = await axiosInstance.post("/cart/add", data);
//     return res.data;
//   } catch (error: any) {
//     throw error.response?.data || error.message;
//   }
// };

// // ✏️ Update Cart Quantity
// export const updateCartQuantity = async (data: {
//   productId: string;
//   quantity: number;
// }) => {
//   try {
//     const res = await axiosInstance.patch("/cart/update", data);
//     return res.data;
//   } catch (error: any) {
//     throw error.response?.data || error.message;
//   }
// };

// // ❌ Remove Item from Cart
// export const removeFromCart = async (productId: string) => {
//   try {
//     const res = await axiosInstance.delete(`/cart/remove/${productId}`);
//     return res.data;
//   } catch (error: any) {
//     throw error.response?.data || error.message;
//   }
// };

// // 👀 Get Cart
// export const getCart = async () => {
//   try {
//     const res = await axiosInstance.get("/cart");
//     return res.data;
//   } catch (error: any) {
//     throw error.response?.data || error.message;
//   }
// };

// /* =========================
//    PRODUCT APIs (User View)
// ========================= */

// // 📦 Get All Products
// export const getAllProducts = async (params?: {
//   page?: number;
//   limit?: number;
//   category?: string;
//   sort?: string;
// }) => {
//   try {
//     const res = await axiosInstance.get("/products", { params });
//     return res.data;
//   } catch (error: any) {
//     throw error.response?.data || error.message;
//   }
// };

// // 🔍 Get Product Details (by slug)
// export const getProductDetails = async (slug: string) => {
//   try {
//     const res = await axiosInstance.get(`/products/${slug}`);
//     return res.data;
//   } catch (error: any) {
//     throw error.response?.data || error.message;
//   }
// };

// export default axiosInstance;