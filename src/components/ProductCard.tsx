import { Plus, Star } from "lucide-react";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="card-product group cursor-pointer"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <div className="relative overflow-hidden aspect-square">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex gap-1.5">
          {product.organic && <span className="badge-organic">Organic</span>}
          {product.originalPrice && <span className="badge-sale">Sale</span>}
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleAdd}
          className="absolute bottom-3 right-3 bg-accent text-accent-foreground p-2.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <Plus className="w-5 h-5" />
        </motion.button>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-1 mb-1">
          <Star className="w-3.5 h-3.5 fill-accent text-accent" />
          <span className="text-xs font-medium text-muted-foreground">{product.rating}</span>
        </div>
        <h3 className="font-semibold text-foreground text-sm md:text-base">{product.name}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{product.unit}</p>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary">₹{product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">₹{product.originalPrice.toFixed(2)}</span>
            )}
          </div>
          <button
            onClick={handleAdd}
            className="md:hidden bg-accent text-accent-foreground p-1.5 rounded-full"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
