import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Star, ShoppingCart, Leaf, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getProductDetails } from "@/api/axios";
import SemicircleFooter from "@/components/SemicircleFooter";
import Header from "@/components/Header";

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedWeight, setSelectedWeight] = useState("250 g");
  const [currentMainImage, setCurrentMainImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getProductDetails(slug!);
        const p = res?.data?.data || res?.data;
        if (!p) throw new Error("Product not found");

        setProduct({
          id: p._id,
          slug: p.slug,
          name: p.name,
          price: p.offerPrice,
          originalPrice: p.originalPrice,
          category: p.category?.name,
          image: p.mainImage?.secure_url,
          unit: p.unit,
          description: p.description,
          organic: true,
          rating: 4.5,
          discount: Math.round(((p.originalPrice - p.offerPrice) / p.originalPrice) * 100)
        });

        setCurrentMainImage(p.mainImage?.secure_url);
      } catch (err: any) {
        setError(err.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchProduct();
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center italic opacity-50 text-foreground">Loading freshness...</div>;
  if (error || !product) return <div className="min-h-screen flex items-center justify-center text-destructive">Product not found.</div>;

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }
    addToCart({ ...product, quantity, weight: selectedWeight });
    toast.success(`${quantity}x ${product.name} added to cart!`);
  };

  const productImages = [product.image, product.image, product.image].filter(Boolean);

  return (
    <>
      
      <div className="bg-background text-foreground transition-colors duration-300 min-h-screen">
        
        {/* Breadcrumbs - Scrollable on very small screens */}
        <div className="border-b border-border">
          <div className="container mx-auto px-4 py-4 flex items-center gap-2 text-xs sm:text-sm opacity-70 overflow-x-auto whitespace-nowrap no-scrollbar">
            <span className="hover:text-primary cursor-pointer transition-colors" onClick={() => navigate('/')}>Home</span>
            <ChevronRight className="w-3 h-3 flex-shrink-0" />
            <span className="hover:text-primary cursor-pointer transition-colors">{product.category}</span>
            <ChevronRight className="w-3 h-3 flex-shrink-0" />
            <span className="font-semibold text-foreground">{product.name}</span>
          </div>
        </div>

        <div className="container mx-auto px-4 lg:px-8 py-6 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

            {/* LEFT: Image Gallery Section */}
            <div className="lg:col-span-7 xl:col-span-6 flex flex-col md:flex-row gap-4">
              
              {/* Thumbnails - Horizontal on mobile, Vertical on MD+ */}
              <div className="flex md:flex-col gap-3 order-2 md:order-1 overflow-x-auto md:overflow-y-auto pb-2 md:pb-0">
                {productImages.map((imgUrl, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentMainImage(imgUrl)}
                    className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-2 overflow-hidden cursor-pointer transition-all duration-200 ${
                      currentMainImage === imgUrl ? 'border-primary shadow-md' : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`thumbnail-${i}`}
                      className={`w-full h-full object-cover transition-opacity duration-300 ${
                        currentMainImage === imgUrl ? 'opacity-100' : 'opacity-60 hover:opacity-100'
                      }`}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Main Image Container */}
              <div className="relative flex-1 aspect-square md:aspect-auto md:h-[500px] bg-card rounded-3xl overflow-hidden border border-border flex items-center justify-center order-1 md:order-2">
                {product.discount > 0 && (
                  <div className="absolute top-0 left-0 bg-primary text-primary-foreground px-4 py-1.5 sm:px-6 sm:py-2 rounded-br-2xl font-bold text-base sm:text-xl z-10 shadow-lg">
                    {product.discount}% Off
                  </div>
                )}
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentMainImage}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    src={currentMainImage}
                    alt={product.name}
                    className="w-[85%] h-[85%] object-contain mix-blend-multiply drop-shadow-xl"
                  />
                </AnimatePresence>
              </div>
            </div>

            {/* RIGHT: Product Details Section */}
            <div className="lg:col-span-5 xl:col-span-6 flex flex-col justify-center space-y-6 md:space-y-8">
              <div className="space-y-3">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                  {product.name}
                </h1>
                <div className="flex items-center gap-3">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                  </div>
                  <span className="text-sm opacity-60 font-medium">(4.8 / 5 Customer Rating)</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-xl sm:text-2xl opacity-40 line-through decoration-destructive/60 font-medium">
                  ₹{product.originalPrice}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl sm:text-6xl font-black text-primary tracking-tighter">₹{product.price}</span>
                  <span className="text-lg font-semibold opacity-60">/ {product.unit || 'unit'}</span>
                </div>
              </div>

              <hr className="border-border" />

              {/* Quantity and CTA */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center justify-between border-2 border-border rounded-2xl px-4 py-3 bg-secondary/50 backdrop-blur-sm sm:w-40">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-background rounded-lg transition-colors shadow-sm"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="text-xl font-bold min-w-[30px] text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-background rounded-lg transition-colors shadow-sm"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  className="flex-1 bg-primary text-primary-foreground py-4 sm:py-0 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-primary/20 font-bold text-lg transition-all hover:bg-primary/90"
                >
                  <ShoppingCart className="w-6 h-6" />
                  Add to Cart
                </motion.button>
              </div>

              {/* Product Meta Tags */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-secondary/30 rounded-xl border border-border/50">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Leaf className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold">100% Organic</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-secondary/30 rounded-xl border border-border/50">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                    <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] text-white">✓</div>
                  </div>
                  <span className="text-sm font-bold">Quality Checked</span>
                </div>
              </div>

              {/* Description Placeholder - Good for UX */}
              <div className="pt-4">
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                  {product.description || "Freshly sourced and packed with nutrients. This organic selection is perfect for maintaining a healthy lifestyle."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </>
  );
};

export default ProductDetail;

// import { useParams, useNavigate } from "react-router-dom";
// import { useCart } from "@/context/CartContext";
// import { useAuth } from "@/context/AuthContext";
// import { motion, AnimatePresence } from "framer-motion";
// import { Plus, Minus, Star, ShoppingCart, Leaf, ChevronRight } from "lucide-react";
// import { useEffect, useState } from "react";
// import { toast } from "sonner";
// import { getProductDetails } from "@/api/axios";
// import SemicircleFooter from "@/components/SemicircleFooter";
// import Header from "@/components/Header";

// const ProductDetail = () => {
//   const { slug } = useParams();
//   const navigate = useNavigate();
//   const { addToCart } = useCart();
//   const { isAuthenticated } = useAuth();

//   const [product, setProduct] = useState<any>(null);
//   const [quantity, setQuantity] = useState(1);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedWeight, setSelectedWeight] = useState("250 g");
//   const [currentMainImage, setCurrentMainImage] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const res = await getProductDetails(slug!);
//         const p = res?.data?.data || res?.data;
//         if (!p) throw new Error("Product not found");

//         setProduct({
//           id: p._id,
//           slug: p.slug,
//           name: p.name,
//           price: p.offerPrice,
//           originalPrice: p.originalPrice,
//           category: p.category?.name,
//           image: p.mainImage?.secure_url,
//           unit: p.unit,
//           description: p.description,
//           organic: true,
//           rating: 4.5,
//           discount: Math.round(((p.originalPrice - p.offerPrice) / p.originalPrice) * 100)
//         });

//         setCurrentMainImage(p.mainImage?.secure_url);
//       } catch (err: any) {
//         setError(err.message || "Failed to load product");
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (slug) fetchProduct();
//   }, [slug]);

//   if (loading) return <div className="min-h-screen flex items-center justify-center italic opacity-50">Loading freshness...</div>;
//   if (error || !product) return <div className="min-h-screen flex items-center justify-center text-destructive">Product not found.</div>;

//   const handleAddToCart = () => {
//     if (!isAuthenticated) {
//       toast.error("Please login to add items to cart");
//       navigate("/login");
//       return;
//     }
//     addToCart({ ...product, quantity, weight: selectedWeight });
//     toast.success(`${quantity}x ${product.name} added to cart!`);
//   };

//   const productImages = [product.image, product.image, product.image].filter(Boolean);

//   return (
//     <>
//       <Header />
//       {/* Main Container uses the --background from index.css base layer automatically via body, 
//           but we ensure it here for the wrapper */}
//       <div className="bg-background text-foreground transition-colors duration-300">

//         {/* Breadcrumbs */}
//         <div className="container mx-auto px-4 py-4 flex items-center gap-2 text-sm opacity-70 border-b border-border">
//           <span className="hover:text-primary cursor-pointer" onClick={() => navigate('/')}>Home</span>
//           <ChevronRight className="w-3 h-3" />
//           <span className="hover:text-primary cursor-pointer">{product.category}</span>
//           <ChevronRight className="w-3 h-3" />
//           <span className="font-semibold">{product.name}</span>
//         </div>

//         <div className="container mx-auto px-4 md:px-9 py-8 ">
//           <div className="container mx-auto grid lg:grid-cols-12 gap-0 ">

//             {/* LEFT: Image Gallery Section */}
//             <div className=" container mx-auto lg:col-span-6 flex flex-col-reverse md:flex-row gap-4 items-start  py-6">

//               {/* Thumbnails */}
//               <div className="flex md:flex-col gap-3 ">
//                 {productImages.map((imgUrl, i) => (
//                   <motion.div
//                     key={i}
//                     // Hover and Tap animations
//                     whileHover={{ scale: 1.10 }}
//                     whileTap={{ scale: 1.00 }}

//                     onClick={() => setCurrentMainImage(imgUrl)}
//                     className={`w-20 h-20 rounded-lg border-2 overflow-hidden cursor-pointer transition-all duration-200 ${currentMainImage === imgUrl
//                         ? 'border-primary shadow-md'
//                         : 'border-border hover:border-primary/50'
//                       }`}
//                   >
//                     <img
//                       src={imgUrl}
//                       alt={`thumbnail-${i}`}
//                       className={`w-full h-full object-cover transition-opacity duration-300 ${currentMainImage === imgUrl ? 'opacity-100' : 'opacity-70 hover:opacity-100'
//                         }`}
//                     />
//                   </motion.div>
//                 ))}
//               </div>

//               {/* Main Image Container */}
//               <div className="relative w-full max-w-[400px] h-[400px] bg-card rounded-3xl overflow-hidden border border-border group flex items-center justify-center">
//                 {product.discount > 0 && (
//                   <div className="absolute top-0 left-0 badge-sale px-6 py-2 rounded-br-2xl font-bold text-xl z-10">
//                     {product.discount}% Off
//                   </div>
//                 )}
//                 <AnimatePresence mode="wait">
//                  <motion.img
//   key={currentMainImage}
//   initial={{ opacity: 0 }}
//   animate={{ opacity: 1 }}
//   exit={{ opacity: 0 }}
//   transition={{ duration: 0.2 }}
//   src={currentMainImage}
//   alt={product.name}
//   // Changed w-auto to w-[90%] and added h-[90%]
//   className="w-[100%] h-[100%] object-contain mix-blend-multiply"
// />
//                 </AnimatePresence>
//               </div>
//             </div>

//             {/* RIGHT: Product Details Section */}
//             <div className="lg:col-span-5 space-y-6">
//               <div>
//                 <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
//                 <div className="flex items-center gap-3">
//                   <div className="flex text-accent">
//                     {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
//                   </div>
//                   <span className="text-sm opacity-60 font-medium">(4.8 / 5 Rating)</span>
//                 </div>
//               </div>

//               <div className="space-y-1">
//                 <span className="text-2xl opacity-40 line-through decoration-destructive font-medium">
//                   ₹{product.originalPrice}
//                 </span>
//                 <div className="flex items-baseline gap-2">
//                   <span className="text-6xl font-black text-primary">₹{product.price}</span>
//                 </div>
//               </div>

//               <hr className="border-border" />

//               {/* Size/Weight Toggle */}
//               {/* <div className="space-y-4">
//                 <h3 className="text-lg font-bold flex items-center gap-2">
//                   Size / Weight :
//                 </h3>
//                 <div className="flex gap-4">
//                   {["250 g", "500 g", "1 kg"].map((size) => (
//                     <button
//                       key={size}
//                       onClick={() => setSelectedWeight(size)}
//                       className={`px-6 py-2 rounded-full border-2 transition-all font-semibold ${selectedWeight === size
//                           ? "bg-accent text-accent-foreground border-accent shadow-md"
//                           : "border-border text-muted-foreground hover:border-primary"
//                         }`}
//                     >
//                       {size}
//                     </button>
//                   ))}
//                 </div>
//               </div> */}

//               {/* Quantity and CTA */}
//               <div className="flex flex-col sm:flex-row gap-4 pt-6">
//                 <div className="flex items-center justify-between border-2 border-border rounded-xl px-4 py-3 bg-secondary min-w-[140px]">
//                   <button
//                     onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                     className="p-1 hover:bg-background rounded-md transition-colors"
//                   >
//                     <Minus className="w-5 h-5" />
//                   </button>
//                   <span className="text-xl font-bold w-10 text-center">{quantity}</span>
//                   <button
//                     onClick={() => setQuantity(quantity + 1)}
//                     className="p-1 hover:bg-background rounded-md transition-colors"
//                   >
//                     <Plus className="w-5 h-5" />
//                   </button>
//                 </div>

//                 <motion.button
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   onClick={handleAddToCart}
//                   className="flex-1 btn-primary py-4 rounded-xl flex items-center justify-center gap-3 shadow-lg transition-all"
//                 >
//                   <ShoppingCart className="w-6 h-6" />
//                   Add to Cart
//                 </motion.button>
//               </div>

//               {/* Product Meta */}
//               <div className="pt-6 grid grid-cols-2 gap-4">
//                 <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
//                   <Leaf className="text-primary w-5 h-5" />
//                   <span className="text-sm font-semibold text-primary">100% Organic</span>
//                 </div>
//                 <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
//                   <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[10px] text-primary-foreground">✓</div>
//                   <span className="text-sm font-semibold">Quality Checked</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <SemicircleFooter />
//     </>
//   );
// };

// export default ProductDetail;

//  below is the perfectly working code  where product is appearing in detail

// import { useParams, useNavigate } from "react-router-dom";
// import { useCart } from "@/context/CartContext";
// import { useAuth } from "@/context/AuthContext";
// import { motion } from "framer-motion";
// import { ArrowLeft, Plus, Minus, Star, ShoppingCart, Leaf } from "lucide-react";
// import { useEffect, useState } from "react";
// import { toast } from "sonner";
// import { getProductDetails } from "@/api/axios";
// import type { Product } from "@/data/products";

// const ProductDetail = () => {
//   const { slug } = useParams(); // 🔥 backend-friendly
//   const navigate = useNavigate();
//   const { addToCart } = useCart();
//   const { isAuthenticated } = useAuth();

// const [product, setProduct] = useState<any>(null);
//   const [quantity, setQuantity] = useState(1);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

// useEffect(() => {
//   const fetchProduct = async () => {
//     try {
//       console.log("Slug:", slug);

//       const res = await getProductDetails(slug!);
//       console.log("API Response:", res);

//       const p = res?.data?.data || res?.data;
//       console.log("Extracted Product:", p);

//       if (!p) throw new Error("Product not found");

//       setProduct({
//         id: p._id,
//         slug: p.slug,
//         name: p.name,
//         price: p.offerPrice,
//         originalPrice: p.originalPrice,
//         category: p.category?.name,
//         image: p.mainImage?.secure_url,
//         unit: p.unit,
//         description: p.description,
//         organic: false,
//         rating: 4.5,
//       });
//     } catch (err: any) {
//       console.error("ERROR:", err);
//       setError(err.message || "Failed to load product");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (slug) fetchProduct();
// }, [slug]);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <p className="text-muted-foreground">Loading product...</p>
//       </div>
//     );
//   }

//   if (error || !product) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <p className="text-red-500">Product not found.</p>
//       </div>
//     );
//   }

//   const handleAddToCart = () => {
//     if (!isAuthenticated) {
//       toast.error("Please login to add items to cart");
//       navigate("/login");
//       return;
//     }

//     addToCart({ ...product, quantity });
//     toast.success(`${quantity}x ${product.name} added to cart!`);
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       <div className="container mx-auto px-4 md:px-6 py-6">
//         <button
//           onClick={() => navigate(-1)}
//           className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
//         >
//           <ArrowLeft className="w-4 h-4" />
//           <span className="text-sm font-medium">Back</span>
//         </button>

//         <div className="grid md:grid-cols-2 gap-10">
//           {/* Image */}
//           <motion.div
//             initial={{ opacity: 0, x: -30 }}
//             animate={{ opacity: 1, x: 0 }}
//             className="rounded-2xl overflow-hidden bg-secondary"
//           >
//             <img
//               src={product.image}
//               alt={product.name}
//               className="w-full h-full object-cover"
//             />
//             <div className="absolute top-4 left-4 flex gap-2">
//               {product.organic && (
//                 <span className="badge-organic flex items-center gap-1">
//                   <Leaf className="w-3 h-3" /> Organic
//                 </span>
//               )}
//               {product.originalPrice && <span className="badge-sale">Sale</span>}
//             </div>
//           </motion.div>

//           {/* Details */}
//           <motion.div
//             initial={{ opacity: 0, x: 30 }}
//             animate={{ opacity: 1, x: 0 }}
//           >
//             <p className="text-sm text-muted-foreground uppercase mb-2">
//               {product.category}
//             </p>

//             <h1 className="text-3xl font-bold mb-3">{product.name}</h1>

//             <div className="flex items-center gap-1 mb-4">
//               {[...Array(5)].map((_, i) => (
//                 <Star
//                   key={i}
//                   className={`w-4 h-4 ${
//                     i < Math.floor(product.rating)
//                       ? "fill-accent text-accent"
//                       : "text-muted-foreground/30"
//                   }`}
//                 />
//               ))}
//               <span className="text-sm text-muted-foreground ml-2">
//                 ({product.rating})
//               </span>
//             </div>

//             <p className="text-muted-foreground mb-6">
//               {product.description}
//             </p>

//             <div className="flex items-center gap-3 mb-6">
//               <span className="text-3xl font-bold text-primary">
//                 ₹{product.price}
//               </span>
//               {product.originalPrice && (
//                 <span className="line-through text-muted-foreground">
//                   ₹{product.originalPrice}
//                 </span>
//               )}
//               <span className="text-sm text-muted-foreground">
//                 / {product.unit}
//               </span>
//             </div>

//             <div className="flex items-center gap-4 mb-8">
//               <div className="flex items-center gap-3 bg-secondary px-4 py-2 rounded-full">
//                 <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
//                   <Minus className="w-4 h-4" />
//                 </button>
//                 <span className="w-8 text-center">{quantity}</span>
//                 <button onClick={() => setQuantity(quantity + 1)}>
//                   <Plus className="w-4 h-4" />
//                 </button>
//               </div>

//               <motion.button
//                 whileTap={{ scale: 0.97 }}
//                 onClick={handleAddToCart}
//                 className="flex-1 flex items-center justify-center gap-2 bg-accent text-white py-3 rounded-full"
//               >
//                 <ShoppingCart className="w-5 h-5" />
//                 Add to Cart — ₹{product.price * quantity}
//               </motion.button>
//             </div>
//           </motion.div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductDetail;

