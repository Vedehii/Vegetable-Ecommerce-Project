// import { products } from "@/data/products";
// import ProductCard from "./ProductCard";

// type Props = {
//   selectedCategory: string;
// };

// const FeaturedProducts = ({ selectedCategory }: Props) => {
//   const filtered = selectedCategory
//     ? products.filter((p) => p.category === selectedCategory)
//     : products;

//   return (
//     <section className="py-10 md:py-14">
//       <div className="container mx-auto px-4 md:px-6">
//         <h2 className="section-title text-center mb-2">
//           {selectedCategory ? "Category Products" : "Featured Products"}
//         </h2>
//         <p className="text-center text-muted-foreground mb-8">
//           Handpicked fresh produce delivered daily
//         </p>
//         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
//           {filtered.map((product) => (
//             <ProductCard key={product.id} product={product} />
//           ))}
//         </div>
//         {filtered.length === 0 && (
//           <p className="text-center text-muted-foreground py-12">No products found in this category.</p>
//         )}
//       </div>
//     </section>
//   );
// };

// export default FeaturedProducts;

// import { useEffect, useState } from "react";
// import ProductCard from "./ProductCard";
// import { getAllProducts } from "@/api/axios";
// import type { Product } from "@/data/products";

// type Props = {
//   selectedCategory: string;
// };

// const FeaturedProducts = ({ selectedCategory }: Props) => {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [showAll, setShowAll] = useState(false);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         setLoading(true);
//         setError("");

//         const res = await getAllProducts();

//        // ✅ Safe backend → frontend mapping
// const productsArray = res?.data ?? [];

// const mappedProducts: Product[] = productsArray.map((p: any) => ({
//   id: p.id || p._id,
//   slug: p.slug,
//   name: p.name,
//   price: p.offerPrice,
//   originalPrice: p.originalPrice,
//   category: p.category?.name,
//   image: p.mainImage?.secure_url,
//   unit: p.unit,
//   description: p.description,
//   organic: false,
//   rating: 4.5,
// }));

//         setProducts(mappedProducts);
//       } catch (err: any) {
//         setError(err.message || "Failed to load products");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, [selectedCategory]);

//   const ITEMS_PER_ROW = 5;
//   const visibleProducts = showAll
//     ? products
//     : products.slice(0, ITEMS_PER_ROW);

//   if (loading) {
//     return (
//       <section className="py-10 text-center text-muted-foreground">
//         Loading products...
//       </section>
//     );
//   }

//   if (error) {
//     return (
//       <section className="py-10 text-center text-red-500">
//         {error}
//       </section>
//     );
//   }

//   return (
//     <section className="py-10 md:py-14">
//       <div className="container mx-auto px-4 md:px-6">
//         <h2 className="section-title text-center mb-2">
//           {selectedCategory ? "Category Products" : "Featured Products"}
//         </h2>

//         <p className="text-center text-muted-foreground mb-8">
//           Handpicked fresh produce delivered daily
//         </p>

//         {products.length === 0 ? (
//           <p className="text-center text-muted-foreground py-12">
//             No products found in this category.
//           </p>
//         ) : (
//           <>
//             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
//               {visibleProducts.map((product) => (
//                 <ProductCard key={product.id} product={product} />
//               ))}
//             </div>

//             {products.length > ITEMS_PER_ROW && (
//               <div className="flex justify-center mt-10">
//                 <button
//                   onClick={() => setShowAll((prev) => !prev)}
//                   className="px-6 py-2 rounded-xl bg-pink-500 text-white font-semibold hover:bg-pink-600 transition"
//                 >
//                   {showAll ? "View Less" : "View More"}
//                 </button>
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </section>
//   );
// };

// export default FeaturedProducts;

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { getAllProducts } from "@/api/axios";
import { Link } from "react-router-dom";
import type { Product } from "@/data/products";

type Props = {
  selectedCategory: string;
};

const FeaturedProducts = ({ selectedCategory }: Props) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await getAllProducts();
        const productsArray = res?.data ?? [];

        const mappedProducts: Product[] = productsArray.map((p: any) => ({
          id: p.id || p._id,
          slug: p.slug,
          name: p.name,
          price: p.offerPrice,
          originalPrice: p.originalPrice,
          category: p.category?.name,
          image: p.mainImage?.secure_url,
          unit: p.unit,
          description: p.description,
          organic: false,
          rating: 4.5,
        }));

        const filteredProducts = selectedCategory
          ? mappedProducts.filter(
              (product) =>
                product.category?.toLowerCase() ===
                selectedCategory.toLowerCase()
            )
          : mappedProducts;

        setProducts(filteredProducts);
      } catch (err: any) {
        setError(err.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  const ITEMS_PER_ROW = 5;
  const visibleProducts = showAll
    ? products
    : products.slice(0, ITEMS_PER_ROW);

  if (loading) {
    return (
      <section className="py-10 text-center text-gray-500">
        Loading products...
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-10 text-center text-red-500">
        {error}
      </section>
    );
  }

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">
          {selectedCategory ? "Category Products" : "Featured Products"}
        </h2>

        <p className="text-center text-gray-500 mb-8">
          Handpicked fresh produce delivered daily
        </p>

        {products.length === 0 ? (
          <p className="text-center text-gray-400 py-10">
            No products found.
          </p>
        ) : (
          <>
            {/* Product Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {visibleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Buttons Section */}
            <div className="flex justify-center mt-8 gap-4 flex-wrap">
              
              {/* View More / View Less (only if more than 5 products) */}
              {products.length > ITEMS_PER_ROW && (
                <button
                  onClick={() => setShowAll((prev) => !prev)}
                  className="px-6 py-2 rounded-xl bg-gray-800 text-white font-semibold hover:bg-gray-700 transition"
                >
                  {showAll ? "View Less" : "View More"}
                </button>
              )}

              {/* ALWAYS SHOW */}
              <Link to="/products">
                <button className="px-8 py-2 rounded-xl bg-orange-500 text-white font-semibold shadow-md hover:bg-orange-600 hover:scale-105 transition-all duration-300">
                  View More →
                </button>
              </Link>

            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;