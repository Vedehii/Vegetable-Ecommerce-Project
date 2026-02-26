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
import { useState } from "react";
import { products } from "@/data/products";
import ProductCard from "./ProductCard";

type Props = {
  selectedCategory: string;
};

const FeaturedProducts = ({ selectedCategory }: Props) => {
  const [showAll, setShowAll] = useState(false);

  const filtered = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : products;

  // 👇 One row logic
  // mobile: 2 cols, desktop: 4 cols
  const ITEMS_PER_ROW = 4;
  const visibleProducts = showAll
    ? filtered
    : filtered.slice(0, ITEMS_PER_ROW);

  return (
    <section className="py-10 md:py-14">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="section-title text-center mb-2">
          {selectedCategory ? "Category Products" : "Featured Products"}
        </h2>

        <p className="text-center text-muted-foreground mb-8">
          Handpicked fresh produce delivered daily
        </p>

        {filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">
            No products found in this category.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {visibleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* VIEW MORE BUTTON */}
            {filtered.length > ITEMS_PER_ROW && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={() => setShowAll((prev) => !prev)}
                  className="px-6 py-2 rounded-xl bg-pink-500 text-white font-semibold hover:bg-pink-600 transition"
                >
                  {showAll ? "View Less" : "View More"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;