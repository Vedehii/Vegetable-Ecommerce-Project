import { useParams, useNavigate } from "react-router-dom";
import { products } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, Minus, Star, ShoppingCart, Leaf } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import ProductCard from "@/components/ProductCard";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [quantity, setQuantity] = useState(1);

  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground text-lg">Product not found.</p>
      </div>
    );
  }

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    toast.success(`${quantity}x ${product.name} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-6 py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back</span>
        </button>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative overflow-hidden rounded-2xl aspect-square bg-secondary"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              {product.organic && <span className="badge-organic flex items-center gap-1"><Leaf className="w-3 h-3" /> Organic</span>}
              {product.originalPrice && <span className="badge-sale">Sale</span>}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col justify-center"
          >
            <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">{product.category.replace("-", " ")}</p>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">{product.name}</h1>
            
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-accent text-accent" : "text-muted-foreground/30"}`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">({product.rating})</span>
            </div>

            <p className="text-muted-foreground mb-6 leading-relaxed">{product.description}</p>

            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold text-primary">₹{product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">₹{product.originalPrice.toFixed(2)}</span>
              )}
              <span className="text-sm text-muted-foreground">/ {product.unit}</span>
            </div>

            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center gap-3 bg-secondary rounded-full px-4 py-2 border border-border">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1 hover:text-primary transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-bold text-foreground w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-1 hover:text-primary transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-accent text-accent-foreground font-bold rounded-full shadow-lg"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart — ₹{(product.price * quantity).toFixed(2)}
              </motion.button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-secondary/60 rounded-xl p-4 text-center">
                <p className="text-xs text-muted-foreground">Category</p>
                <p className="font-semibold text-foreground text-sm capitalize">{product.category.replace("-", " ")}</p>
              </div>
              <div className="bg-secondary/60 rounded-xl p-4 text-center">
                <p className="text-xs text-muted-foreground">Unit</p>
                <p className="font-semibold text-foreground text-sm">{product.unit}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {relatedProducts.length > 0 && (
          <section className="mt-16 mb-10">
            <h2 className="section-title text-center mb-2">Related Products</h2>
            <p className="text-center text-muted-foreground mb-8">You might also like these</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
