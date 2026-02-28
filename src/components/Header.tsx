// import { ShoppingCart, LogOut, Search, Leaf, MapPin, LogIn } from "lucide-react";
// import { useCart } from "@/context/CartContext";
// import { useAuth } from "@/context/AuthContext";
// import { motion } from "framer-motion";
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const locations = [
//   "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai",
//   "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Lucknow",
// ];

// const Header = () => {
//   const { totalItems, setIsCartOpen } = useCart();
//   const { user, logout, isAuthenticated } = useAuth();
//   const [selectedLocation, setSelectedLocation] = useState("Mumbai");
//   const [showLocationDropdown, setShowLocationDropdown] = useState(false);
//   const navigate = useNavigate();

//   return (
//     <header className="sticky top-0 z-50 bg-card/90 backdrop-blur-md border-b border-border shadow-sm">
//       <div className="container mx-auto px-4 md:px-6 flex items-center justify-between h-16 md:h-20">
//         <div className="flex items-center gap-4">
//           <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
//             <Leaf className="w-7 h-7 text-primary" />
//             <span className="font-display text-2xl font-bold text-foreground">
//               Fresh<span className="text-accent">Cart</span>
//             </span>
//           </div>

//           {/* Location Picker */}
//           <div className="relative">
//             <button
//               onClick={() => setShowLocationDropdown(!showLocationDropdown)}
//               className="flex items-center gap-1.5 text-sm bg-secondary hover:bg-secondary/80 px-3 py-1.5 rounded-full transition-colors"
//             >
//               <MapPin className="w-3.5 h-3.5 text-accent" />
//               <span className="text-foreground font-medium hidden sm:inline">{selectedLocation}</span>
//             </button>
//             {showLocationDropdown && (
//               <>
//                 <div className="fixed inset-0 z-40" onClick={() => setShowLocationDropdown(false)} />
//                 <motion.div
//                   initial={{ opacity: 0, y: -8 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   className="absolute top-full left-0 mt-2 bg-card border border-border rounded-xl shadow-xl z-50 py-2 w-44 max-h-60 overflow-y-auto"
//                 >
//                   {locations.map((loc) => (
//                     <button
//                       key={loc}
//                       onClick={() => { setSelectedLocation(loc); setShowLocationDropdown(false); }}
//                       className={`w-full text-left px-4 py-2 text-sm transition-colors ${loc === selectedLocation ? "bg-primary/10 text-primary font-semibold" : "text-foreground hover:bg-secondary"}`}
//                     >
//                       {loc}
//                     </button>
//                   ))}
//                 </motion.div>
//               </>
//             )}
//           </div>
//         </div>

//         <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
//           <div className="relative w-full">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//             <input
//               type="text"
//               placeholder="Search fresh produce..."
//               className="w-full pl-10 pr-4 py-2.5 bg-secondary rounded-full text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
//             />
//           </div>
//         </div>

//         <div className="flex items-center gap-3">
//           {isAuthenticated && user && (
//             <span className="hidden md:block text-sm font-medium text-muted-foreground">
//               Hi, {user.name}
//             </span>
//           )}
//           <button
//             onClick={() => setIsCartOpen(true)}
//             className="relative p-2.5 rounded-full bg-secondary hover:bg-primary/10 transition-colors"
//           >
//             <ShoppingCart className="w-5 h-5 text-foreground" />
//             {totalItems > 0 && (
//               <motion.span
//                 initial={{ scale: 0 }}
//                 animate={{ scale: 1 }}
//                 className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
//               >
//                 {totalItems}
//               </motion.span>
//             )}
//           </button>
//           {isAuthenticated ? (
//             <button onClick={logout} className="p-2.5 rounded-full bg-secondary hover:bg-destructive/10 transition-colors" title="Logout">
//               <LogOut className="w-5 h-5 text-foreground" />
//             </button>
//           ) : (
//             <button onClick={() => navigate("/login")} className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
//               <LogIn className="w-4 h-4" />
//               <span className="hidden sm:inline">Login</span>
//             </button>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;

import {
  ShoppingCart,
  LogOut,
  Search,
  Leaf,
  MapPin,
  LogIn,
  MoreVertical,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getCreditStatus, getMyOrders } from "@/api/axios";

const locations = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Pune",
  "Ahmedabad",
  "Jaipur",
  "Lucknow",
];

const Header = () => {
  const { totalItems, setIsCartOpen } = useCart();
  const { user, logout, isAuthenticated } = useAuth();
  const [selectedLocation, setSelectedLocation] = useState("Mumbai");
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const navigate = useNavigate();

  // 🔥 Scroll to Footer
  const handleContactScroll = () => {
    const footer = document.getElementById("contact");
    if (footer) {
      const yOffset = -80; // adjust if header height changes
      const y =
        footer.getBoundingClientRect().top +
        window.pageYOffset +
        yOffset;

      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  // ============ Fetch User Data ============
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchData = async () => {
      try {
        const ordersRes = await getMyOrders();
        const orders = ordersRes?.data || ordersRes || [];
        setOrderCount(orders.length || 0);

        const creditRes = await getCreditStatus();
        const creditData = creditRes?.data || creditRes;
        setCredit(creditData?.availableCredit || 0);
      } catch (err) {
        console.log("Header API Error:", err);
      }
    };
    fetchData();
  }, [isAuthenticated]);

  function setShowMenuDropdown(arg0: boolean): void {
    throw new Error("Function not implemented.");
  }

  return (
    <>
      {/* 🔹 TOP STRIP */}
      <div className="w-full bg-gray-50 text-sm text-gray-700 border-b">
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between h-10">

          {/* Left Side */}
          <div className="flex items-center gap-2">
            <button className="hover:underline">
              Why KisanKonnect?
            </button>          
             <span className="text-lg">🍎</span>
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/about" className="hover:underline">
              About Us
            </Link>

            <button className="hover:underline">
              Careers@KisanKonnect
            </button>

            <button
              onClick={handleContactScroll}
              className="hover:underline"
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>

      {/* 🔹 MAIN HEADER */}
      <header className="sticky top-0 z-50 bg-card/90 backdrop-blur-md border-b border-border shadow-sm">
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between h-16 md:h-20">

          {/* Left Section */}
          <div className="flex items-center gap-4">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <Leaf className="w-7 h-7 text-primary" />
              <span className="font-display text-2xl font-bold text-foreground">
                Fresh<span className="text-accent">Cart</span>
              </span>
            </div>

            {/* Location Picker */}
            <div className="relative">
              <button
                onClick={() =>
                  setShowLocationDropdown(!showLocationDropdown)
                }
                className="flex items-center gap-1.5 text-sm bg-secondary hover:bg-secondary/80 px-3 py-1.5 rounded-full transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-accent" />
                <span className="text-foreground font-medium hidden sm:inline">
                  {selectedLocation}
                </span>
              </button>

              {showLocationDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() =>
                      setShowLocationDropdown(false)
                    }
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-0 mt-2 bg-card border border-border rounded-xl shadow-xl z-50 py-2 w-44 max-h-60 overflow-y-auto"
                  >
                    {locations.map((loc) => (
                      <button
                        key={loc}
                        onClick={() => {
                          setSelectedLocation(loc);
                          setShowLocationDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                          loc === selectedLocation
                            ? "bg-primary/10 text-primary font-semibold"
                            : "text-foreground hover:bg-secondary"
                        }`}
                      >
                        {loc}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </div>
          </div>

          {/* Search */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search fresh produce..."
                className="w-full pl-10 pr-4 py-2.5 bg-secondary rounded-full text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {isAuthenticated && user && (
              <span className="hidden md:block text-sm font-medium text-muted-foreground">
                Hi  {user.name}
              </span>
            )}

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-full bg-secondary hover:bg-primary/10 transition-colors"
            >
              <ShoppingCart className="w-5 h-5 text-foreground" />
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
                >
                  {totalItems}
                </motion.span>
              )}
            </button>
            
            {isAuthenticated && (
              <div className="relative">
                <button onClick={() => setShowMenuDropdown(!setShowMenuDropdown)} className="p-2 rounded-full hover:bg-secondary transition">
                  <MoreVertical className="w-5 h-5" />
                </button>
                {setShowMenuDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-64 bg-card border border-border rounded-xl shadow-xl z-50 p-4"
                  >
                    <div className="space-y-3 text-sm">
                      {/* <div className="flex justify-between"><span>Orders</span><span className="font-semibold">{orderCount}</span></div>
                      <div className="flex justify-between"><span>Credit</span><span className="font-semibold text-primary">₹ {credit}</span></div> */}
                      <hr />
                      <button onClick={() => navigate("/my-orders")} className="w-full text-left hover:text-primary">My Orders</button>
                      <button onClick={() => navigate("/my-addresses")} className="w-full text-left hover:text-primary">My Addresses</button>
                      <button onClick={() => navigate("/credit-status")} className="w-full text-left hover:text-primary">Credit Status</button>
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {isAuthenticated ? (
              <button
                onClick={logout}
                className="p-2.5 rounded-full bg-secondary hover:bg-destructive/10 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5 text-foreground" />
              </button>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">Login</span>
              </button>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;

function setOrderCount(arg0: any) {
  throw new Error("Function not implemented.");
}
function setCredit(arg0: any) {
  throw new Error("Function not implemented.");
}

