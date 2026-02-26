import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const CartSidebar = () => {
  const { items, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, clearCart, totalPrice, totalItems } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleOrder = () => {
    if (!isAuthenticated) {
      toast.error("Please login to place an order");
      setIsCartOpen(false);
      navigate("/login");
      return;
    }
    toast.success("Order placed successfully! 🎉");
    clearCart();
    setIsCartOpen(false);
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-card z-50 shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                <h2 className="font-display text-xl font-bold text-foreground">Your Cart</h2>
                <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">{totalItems}</span>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="p-2 rounded-full hover:bg-secondary transition-colors">
                <X className="w-5 h-5 text-foreground" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground font-medium">Your cart is empty</p>
                  <p className="text-sm text-muted-foreground mt-1">Add some fresh produce!</p>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex gap-3 bg-secondary/50 rounded-xl p-3"
                  >
                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-foreground truncate">{item.name}</h4>
                      <p className="text-xs text-muted-foreground">{item.unit}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2 bg-card rounded-full border border-border">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 hover:text-primary transition-colors">
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-sm font-semibold w-5 text-center text-foreground">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 hover:text-primary transition-colors">
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="font-bold text-sm text-primary">₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="self-start p-1 text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-5 border-t border-border space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-medium">Subtotal</span>
                  <span className="text-xl font-bold text-foreground">₹{totalPrice.toFixed(2)}</span>
                </div>
                <button
                  onClick={handleOrder}
                  className="w-full py-3.5 bg-accent text-accent-foreground font-bold rounded-full hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-lg"
                >
                  Place Order — ₹{totalPrice.toFixed(2)}
                </button>
                <button
                  onClick={clearCart}
                  className="w-full py-2.5 bg-secondary text-foreground font-medium rounded-full hover:bg-destructive/10 transition-colors text-sm"
                >
                  Clear Cart
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;
