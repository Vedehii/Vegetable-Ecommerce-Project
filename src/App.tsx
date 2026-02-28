import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom"; // Added Outlet
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";

// Import your Navbar component
import Navbar from "@/components/Header"; 

import Index from "./pages/Index";
import Login from "./pages/Login";
import ProductDetail from "./pages/ProductDetail";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import  Footer  from "@/components/SemicircleFooter";
import CartSidebar from "./components/CartSidebar";
import AllProducts from "./pages/AllProduct";
import MyOrders from "./pages/MyOrders";
import TrackOrder from "./pages/TrackOrders";
import MyAddresses from "./pages/MyAddresses";
import CreditStatus from "./pages/CreaditStatus";
import Checkout from "./pages/Checkout";

const queryClient = new QueryClient();

// 1. Define the Layout wrapper
const Layout = () => {
  return (
    <>
      <Navbar />
      <CartSidebar />
      <main>
        <Outlet /> 
      </main>
      <Footer/>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <Routes>
              {/* Login route stays outside the Layout */}
              <Route path="/login" element={<Login />} />

              {/* 2. Wrap all other routes in the Layout component */}
              <Route element={<Layout />}>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/product/:slug" element={<ProductDetail />} />
                <Route path="/products" element={<AllProducts />} />
                <Route path="/my-orders" element={<MyOrders />} />
<Route path="/track-order/:orderNumber" element={<TrackOrder />} />
<Route path="/my-addresses" element={<MyAddresses />} />
<Route path="/credit-status" element={<CreditStatus />} />
<Route path="/checkout" element={<Checkout />} />
                <Route path="*" element={<NotFound />} />

              </Route>
            </Routes>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { AuthProvider } from "@/context/AuthContext";
// import { CartProvider } from "@/context/CartContext";
// import Index from "./pages/Index";
// import Login from "./pages/Login";
// import ProductDetail from "./pages/ProductDetail";
// import NotFound from "./pages/NotFound";
// import About from "./pages/About";

// const queryClient = new QueryClient();

// const App = () => (
//   <QueryClientProvider client={queryClient}>
//     <TooltipProvider>
//       <Toaster />
//       <Sonner />
//       <BrowserRouter>
//         <AuthProvider>
//           <CartProvider>
//             <Routes>
//               <Route path="/login" element={<Login />} />
//               <Route path="/" element={<Index />} />
//               <Route path="about" element={<About/>} />
//               <Route path="/product/:slug" element={<ProductDetail />} />
//               <Route path="*" element={<NotFound />} />
//             </Routes>
//           </CartProvider>
//         </AuthProvider>
//       </BrowserRouter>
//     </TooltipProvider>
//   </QueryClientProvider>
// );

// export default App;
