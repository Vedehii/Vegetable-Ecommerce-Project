// import { createContext, useContext, useState, ReactNode } from "react";
// import { Product } from "@/data/products";

// export type CartItem = Product & { quantity: number };

// type CartContextType = {
//   items: CartItem[];
//   addToCart: (product: Product) => void;
//   removeFromCart: (id: number) => void;
//   updateQuantity: (id: number, quantity: number) => void;
//   clearCart: () => void;
//   totalItems: number;
//   totalPrice: number;
//   isCartOpen: boolean;
//   setIsCartOpen: (open: boolean) => void;
// };

// const CartContext = createContext<CartContextType | null>(null);

// export const useCart = () => {
//   const ctx = useContext(CartContext);
//   if (!ctx) throw new Error("useCart must be used within CartProvider");
//   return ctx;
// };

// export const CartProvider = ({ children }: { children: ReactNode }) => {
//   const [items, setItems] = useState<CartItem[]>([]);
//   const [isCartOpen, setIsCartOpen] = useState(false);

//   const addToCart = (product: Product) => {
//     setItems((prev) => {
//       const existing = prev.find((i) => i.id === product.id);
//       if (existing) return prev.map((i) => (i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i));
//       return [...prev, { ...product, quantity: 1 }];
//     });
//   };

//   const removeFromCart = (id: number) => setItems((prev) => prev.filter((i) => i.id !== id));

//   const updateQuantity = (id: number, quantity: number) => {
//     if (quantity <= 0) return removeFromCart(id);
//     setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)));
//   };

//   const clearCart = () => setItems([]);
//   const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
//   const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

//   return (
//     <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice, isCartOpen, setIsCartOpen }}>
//       {children}
//     </CartContext.Provider>
//   );
// };
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Product } from "@/data/products";
import {
  addToCart as addToCartAPI,
  updateCartQuantity,
  removeFromCart as removeFromCartAPI,
  getCart,
} from "@/api/axios";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export type CartItem = {
  id: string; // ✅ this is product._id
  name: string;
  price: number;
  image: string;
  unit: string;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (product: Product) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  refreshCart: () => Promise<void>;
};

const CartContext = createContext<CartContextType | null>(null);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();

  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  /* =========================
     FETCH CART (SAFE)
  ========================= */
  const fetchCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await getCart();
      console.log(res?.data?.items)

      const mappedItems: CartItem[] =
        res?.data?.items?.map((item: any) => ({
          id: item.product._id, // ✅ ALWAYS product._id
          name: item.product.name,
          price:
            item.product.offerPrice ??
            item.product.originalPrice ??
            0,
          image: item.product.image?.[0] || "/images/placeholder.png",
          unit: item.product.unit || "1 unit",
          quantity: item.quantity,
        })) || [];

      setItems(mappedItems);
    } catch (error) {
      console.error("Fetch cart failed:", error);
    }
  };

  /* =========================
     LOAD / CLEAR CART ON AUTH CHANGE
  ========================= */
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setItems([]);
    }
  }, [isAuthenticated]);

  /* =========================
     ADD TO CART
  ========================= */
  const addToCart = async (product: Product) => {
  const token = localStorage.getItem("token");
  console.log("TOKEN AT ADD:", localStorage.getItem("token"));

  if (!token) {
    toast.error("Please login to add items to cart");
    return;
  }

  try {
    await addToCartAPI({
      productId: product.id, // ✅ correct
      quantity: 1,
    });

    await fetchCart();
    toast.success("Added to cart");
  } catch (err: any) {
    toast.error(err?.message || "Failed to add to cart");
  }
};

  /* =========================
     REMOVE FROM CART
  ========================= */
  const removeFromCart = async (productId: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await removeFromCartAPI(productId); // ✅ product._id
      await fetchCart();
    } catch (err: any) {
      toast.error(err?.message || "Failed to remove item");
    }
  };

  /* =========================
     UPDATE QUANTITY
  ========================= */
  const updateQuantity = async (productId: string, quantity: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    try {
      await updateCartQuantity({
        productId, // ✅ product._id
        quantity,
      });

      await fetchCart();
    } catch (err: any) {
      toast.error(err?.message || "Failed to update quantity");
    }
  };

  /* =========================
     CLEAR CART
  ========================= */
  const clearCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await Promise.all(
        items.map((item) =>
          removeFromCartAPI(item.id) // ✅ product._id
        )
      );

      setItems([]);
      toast.success("Cart cleared");
    } catch {
      toast.error("Failed to clear cart");
    }
  };

  const totalItems = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isCartOpen,
        setIsCartOpen,
        refreshCart: fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};