import { useEffect, useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { getAllProducts } from "@/api/axios";
import type { Product } from "@/data/products";

const AllProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOption, setSortOption] = useState("default");

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  /* ================= GET CATEGORY FROM URL ================= */
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [searchParams]);

  /* ================= FETCH PRODUCTS ================= */
  useEffect(() => {
    const fetchProducts = async () => {
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

      setProducts(mappedProducts);
    };

    fetchProducts();
  }, []);

  const categories = ["All", ...new Set(products.map((p) => p.category))];

  /* ================= FILTER + SORT ================= */
  const filteredProducts = useMemo(() => {
    let updated = [...products];

    if (selectedCategory !== "All") {
      updated = updated.filter(
        (p) =>
          p.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (sortOption === "low-high") {
      updated.sort((a, b) => a.price - b.price);
    } else if (sortOption === "high-low") {
      updated.sort((a, b) => b.price - a.price);
    }

    return updated;
  }, [products, selectedCategory, sortOption]);

  return (
    <section className="py-12 min-h-screen">
      <div className="container mx-auto px-4">

        {/* ================= HEADER ================= */}
        <div className="flex justify-between items-center mb-10">
          <button
            onClick={() => navigate(-1)}
            className="btn-primary px-4 py-2 rounded-lg"
          >
            ← Back
          </button>

          <h1 className="section-title text-center flex-1">
            {selectedCategory === "All"
              ? "All Products"
              : `${selectedCategory}`}
          </h1>

          <div className="w-[90px]" />
        </div>

        {/* ================= MODERN FILTER BAR ================= */}
        <div className="card-product p-5 mb-10 sticky top-20 z-10">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

            {/* CATEGORY SEGMENTED FILTER */}
            <div className="flex items-center gap-4 overflow-x-auto">

              <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                Category:
              </span>

              <div className="flex bg-muted rounded-full p-1">
                {categories.map((cat, index) => {
                  const isActive = selectedCategory === cat;

                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-1.5 text-sm rounded-full transition-all duration-300 ${
                        isActive
                          ? "btn-primary"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SORT + RESET */}
            <div className="flex items-center gap-4">

              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="border border-border rounded-full px-4 py-2 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition"
              >
                <option value="default">Default</option>
                <option value="low-high">Price: Low → High</option>
                <option value="high-low">Price: High → Low</option>
              </select>

              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setSortOption("default");
                }}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition"
              >
                Reset
              </button>

            </div>
          </div>
        </div>

        {/* ================= PRODUCT COUNT ================= */}
        <p className="mb-8 text-muted-foreground text-sm">
          Showing {filteredProducts.length} products
        </p>

        {/* ================= PRODUCT GRID ================= */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="transition-transform duration-300 hover:scale-105"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default AllProducts;