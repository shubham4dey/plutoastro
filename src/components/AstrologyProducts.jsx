import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const AstrologyProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("🔍 Fetching products from API...");
      
      const response = await fetch(
        "https://plutoastro-backend.onrender.com/api/products"
      );
      
      console.log(" Response status:", response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("📦 Received data:", data);
      
      // Handle different response structures
      let productsData = [];
      
      if (Array.isArray(data)) {
        productsData = data;
      } else if (data.products && Array.isArray(data.products)) {
        productsData = data.products;
      } else if (data.content && Array.isArray(data.content)) {
        productsData = data.content;
      } else if (data.data && Array.isArray(data.data)) {
        productsData = data.data;
      } else {
        console.warn("⚠️ Unexpected data structure, using fallback");
        productsData = getFallbackProducts();
      }
      
      console.log(`✅ Loaded ${productsData.length} products`);
      setProducts(productsData);
      
    } catch (err) {
      console.error("❌ Error fetching products:", err);
      setError("Failed to load products. Please try again later.");
      // Always use fallback data
      setProducts(getFallbackProducts());
    } finally {
      setLoading(false);
    }
  };

  // Fallback products if API fails
  const getFallbackProducts = () => [
    {
      _id: "1",
      name: "Birth Chart Reading",
      description: "Get your personalized natal chart with detailed planetary positions and life predictions.",
      image: "https://images.unsplash.com/photo-1532968961962-8a0cb3a2d4f0?w=300&h=300&fit=crop",
      category: "Western",
      price: 49.99,
      slug: "birth-chart-reading"
    },
    {
      _id: "2",
      name: "Tarot Card Deck",
      description: "Premium Rider-Waite tarot deck for accurate readings and spiritual guidance.",
      image: "https://images.unsplash.com/photo-1600609842388-3e4b0c2e3b1a?w=300&h=300&fit=crop",
      category: "Western",
      price: 29.99,
      slug: "tarot-card-deck"
    },
    {
      _id: "3",
      name: "Crystal Healing Set",
      description: "Authentic amethyst, rose quartz & clear quartz for energy balancing and meditation.",
      image: "https://images.unsplash.com/photo-1612438214708-f428a707dd0e?w=300&h=300&fit=crop",
      category: "Western",
      price: 39.99,
      slug: "crystal-healing-set"
    },
    {
      _id: "4",
      name: "Zodiac Jewelry",
      description: "Elegant 925 silver zodiac sign pendants and rings for daily cosmic connection.",
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=300&fit=crop",
      category: "Western",
      price: 59.99,
      slug: "zodiac-jewelry"
    },
    {
      _id: "5",
      name: "Astrology Books",
      description: "Bestselling guides on Western astrology, transits, and horoscope interpretation.",
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=300&fit=crop",
      category: "Western",
      price: 24.99,
      slug: "astrology-books"
    },
    {
      _id: "6",
      name: "Moon Phase Calendar",
      description: "2026 lunar calendar with rituals, manifestations and cosmic events tracker.",
      image: "https://images.unsplash.com/photo-1532693322450-2cb5c511067d?w=300&h=300&fit=crop",
      category: "Western",
      price: 19.99,
      slug: "moon-phase-calendar"
    },
    {
      _id: "7",
      name: "Rudraksha Mala",
      description: "Original 5 Mukhi Rudraksha beads for peace, protection and spiritual growth.",
      image: "https://images.unsplash.com/photo-1608042314453-ae338d80c427?w=300&h=300&fit=crop",
      category: "Indian",
      price: 34.99,
      slug: "rudraksha-mala"
    },
    {
      _id: "8",
      name: "Vedic Yantra",
      description: "Energized Sri Yantra for prosperity, abundance and cosmic alignment.",
      image: "https://images.unsplash.com/photo-1609234656388-0ff3633c373f?w=300&h=300&fit=crop",
      category: "Indian",
      price: 44.99,
      slug: "vedic-yantra"
    },
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  // Skeleton Loader
  const SkeletonCard = () => (
    <div className="bg-purple-900/20 backdrop-blur-sm rounded-2xl border border-purple-700/30 overflow-hidden animate-pulse">
      <div className="h-48 lg:h-56 bg-purple-900/40"></div>
      <div className="p-5 lg:p-6 space-y-3">
        <div className="h-6 bg-purple-800/50 rounded w-3/4"></div>
        <div className="h-4 bg-purple-800/30 rounded w-full"></div>
        <div className="h-4 bg-purple-800/30 rounded w-2/3"></div>
        <div className="h-10 bg-purple-700/50 rounded-lg w-full mt-4"></div>
      </div>
    </div>
  );

  if (error && products.length === 0) {
    return (
      <section className="py-16 lg:py-24 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="bg-red-900/20 border border-red-700/50 rounded-2xl p-8">
            <i className="ri-error-warning-line text-red-400 text-5xl mb-4"></i>
            <h3 className="text-2xl font-bold text-white mb-2">Oops! Something went wrong</h3>
            <p className="text-purple-200/70 mb-6">{error}</p>
            <button
              onClick={fetchProducts}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-semibold rounded-lg hover:from-purple-500 hover:to-fuchsia-500 transition-all"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 lg:py-24 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4">
            Astrological Remedies & Products
          </h2>
          <p className="text-purple-200/80 text-base lg:text-lg max-w-2xl mx-auto">
            Discover powerful tools, crystals, and spiritual products to enhance your cosmic journey
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[...Array(8)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <>
            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {products.map((product) => (
                <div
                  key={product._id || product.id || Math.random()}
                  className="group bg-purple-900/20 backdrop-blur-sm rounded-2xl border border-purple-700/30 overflow-hidden hover:border-purple-500/60 hover:shadow-2xl hover:shadow-purple-900/40 transition-all duration-500 hover:-translate-y-2"
                >
                  {/* Image Container */}
                  <div className="relative h-48 lg:h-56 overflow-hidden bg-gradient-to-br from-purple-900/40 to-black/60">
                    <img
                      src={product.image || product.imageUrl || "https://images.unsplash.com/photo-1532968961962-8a0cb3a2d4f0?w=300&h=300&fit=crop"}
                      alt={product.name || product.title || "Product"}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1532968961962-8a0cb3a2d4f0?w=300&h=300&fit=crop";
                      }}
                    />
                    {/* Category Badge */}
                    <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${
                      (product.category || "").toLowerCase() === "indian"
                        ? "bg-orange-500/90 text-white" 
                        : "bg-purple-600/90 text-white"
                    }`}>
                      {product.category || "Western"}
                    </span>
                    {/* Price Badge */}
                    {product.price && (
                      <span className="absolute top-3 left-3 px-3 py-1 bg-black/70 text-white rounded-full text-sm font-bold">
                        €{product.price}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5 lg:p-6">
                    <h3 className="text-lg lg:text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                      {product.name || product.title || "Product"}
                    </h3>
                    <p className="text-purple-200/70 text-sm mb-4 line-clamp-2">
                      {product.description || "Premium astrological product for your spiritual journey"}
                    </p>
                    <Link
                      to={`/shop/${product.slug || product._id || product.id || "#"}`}
                      className="block w-full py-2.5 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-semibold text-sm rounded-lg hover:from-purple-500 hover:to-fuchsia-500 transition-all duration-300 shadow-lg shadow-purple-900/30 text-center"
                    >
                      {product.buttonText || "VIEW DETAILS"}
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* View All Button */}
            <div className="text-center mt-12 lg:mt-16">
              <Link
                to="/shop"
                className="inline-block px-8 py-3 bg-transparent border-2 border-purple-500 text-white font-semibold rounded-lg hover:bg-purple-600 transition-all duration-300"
              >
                View All Products
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default AstrologyProducts;