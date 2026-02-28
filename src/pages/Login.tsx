
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Leaf, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Login = () => {
  const { login, signup, verifyUserOtp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isSignup, setIsSignup] = useState(false);
  const [otpStep, setOtpStep] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || (!otpStep && !password)) {
      return setError("Please fill in all required fields");
    }

    if (isSignup && !otpStep && !name) {
      return setError("Please enter your name");
    }

    setLoading(true);

    try {
      /* =========================
         SIGNUP STEP 1 → REGISTER
      ========================= */
      if (isSignup && !otpStep) {
        await signup(name, email, password);
        setOtpStep(true);
        setLoading(false);
        return;
      }

      /* =========================
         SIGNUP STEP 2 → VERIFY OTP
      ========================= */
      if (isSignup && otpStep) {
        await verifyUserOtp({
          name,
          email,
          password,
          role: "customer",
          otp,
        });

        // Auto login after verification
        await login(email, password);

        toast({
          title: "Account Created 🎉",
          description: "You can now login",
        });

        navigate("/");
        setLoading(false);
        return;
      }

      /* =========================
         LOGIN
      ========================= */
      await login(email, password);

      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });

      navigate("/");
      setLoading(false);

    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          err?.message ||
          err?.error ||
          err?.data?.message ||
          "Something went wrong",
      });
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative items-center justify-center overflow-hidden">
      {/* Back button at top-left */}
        {/* Back button at top-left */}
<button
  onClick={() => navigate("/")}
  className="absolute top-8 left-8 flex items-center gap-2 p-2 rounded-full hover:bg-primary-foreground/20 text-white transition-colors z-20"
>
  <ArrowLeft className="w-5 h-5" />
  <span className="font-semibold">Back</span>
</button>
        <div className="absolute inset-0 opacity-10">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-primary-foreground"
              style={{
                width: `${80 + i * 40}px`,
                height: `${80 + i * 40}px`,
                top: `${10 + i * 15}%`,
                left: `${5 + i * 12}%`,
                opacity: 0.1 + i * 0.05,
              }}
            />
          ))}
        </div>
        <div className="relative z-10 text-center px-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
          >
            <Leaf className="w-20 h-20 text-primary-foreground mx-auto mb-6" />
          </motion.div>
          <h1 className="font-display text-5xl font-bold text-primary-foreground mb-4">
            FreshCart
          </h1>
          <p className="text-primary-foreground/80 text-lg max-w-sm mx-auto">
            Farm-fresh vegetables and fruits delivered to your doorstep.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden flex items-center gap-2 justify-center mb-8">
            <Leaf className="w-8 h-8 text-primary" />
            <span className="font-display text-3xl font-bold text-foreground">
              Fresh<span className="text-accent">Cart</span>
            </span>
          </div>

          <h2 className="font-display text-3xl font-bold text-foreground mb-2">
            {isSignup
              ? otpStep
                ? "Verify OTP"
                : "Create Account"
              : "Welcome Back"}
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* NAME */}
            {isSignup && !otpStep && (
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-secondary rounded-xl"
                />
              </div>
            )}

            {/* EMAIL */}
            {!otpStep && (
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-secondary rounded-xl"
                />
              </div>
            )}

            {/* PASSWORD */}
            {!otpStep && (
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-secondary rounded-xl pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* OTP */}
            {isSignup && otpStep && (
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Enter OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-3 bg-secondary rounded-xl"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-primary text-primary-foreground font-bold rounded-full"
            >
              {loading
                ? "Please wait..."
                : isSignup
                  ? otpStep
                    ? "Verify OTP"
                    : "Send OTP"
                  : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm mt-6">
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => {
                setIsSignup(!isSignup);
                setOtpStep(false);
                setError("");
              }}
              className="text-primary font-semibold hover:underline"
            >
              {isSignup ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;

// import { useState } from "react";
// import { useAuth } from "@/context/AuthContext";
// import { motion } from "framer-motion";
// import { Leaf, Eye, EyeOff } from "lucide-react";
// import { toast } from "sonner";
// import { useNavigate } from "react-router-dom";


// const Login = () => {
//   const { login, signup, verifyUserOtp } = useAuth();
//   const navigate = useNavigate();

//   const [isSignup, setIsSignup] = useState(false);
//   const [otpStep, setOtpStep] = useState(false);

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [otp, setOtp] = useState("");

//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");

//     if (!email || !password) {
//       return setError("Please fill in all fields");
//     }

//     if (isSignup && !otpStep && !name) {
//       return setError("Please enter your name");
//     }

//     setLoading(true);

//     try {
//       /* =========================
//          SIGNUP STEP 1 → REGISTER
//       ========================= */
//       if (isSignup && !otpStep) {
//         await signup(name, email, password);
//         setOtpStep(true);
//         setLoading(false);
//         return;
//       }

//       /* =========================
//          SIGNUP STEP 2 → VERIFY OTP
//       ========================= */
//       if (isSignup && otpStep) {
//         await verifyUserOtp(email, otp);

//         // Auto login after verification
//         await login(email, password);

//         toast.success("Account created successfully 🎉");
//         navigate("/");
//         setLoading(false);
//         return;
//       }

//       /* =========================
//          LOGIN
//       ========================= */
//       await login(email, password);

//       toast.success("Login Successful 🎉");
//       setLoading(false);

//     } catch (err: any) {
//       setError(
//         err?.message ||
//         err?.error ||
//         "Something went wrong"
//       );
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex">
//       {/* Left panel */}
//       <div className="hidden lg:flex lg:w-1/2 bg-primary relative items-center justify-center overflow-hidden">
//         <div className="absolute inset-0 opacity-10">
//           {[...Array(6)].map((_, i) => (
//             <div
//               key={i}
//               className="absolute rounded-full bg-primary-foreground"
//               style={{
//                 width: `${80 + i * 40}px`,
//                 height: `${80 + i * 40}px`,
//                 top: `${10 + i * 15}%`,
//                 left: `${5 + i * 12}%`,
//                 opacity: 0.1 + i * 0.05,
//               }}
//             />
//           ))}
//         </div>
//         <div className="relative z-10 text-center px-12">
//           <motion.div
//             initial={{ scale: 0 }}
//             animate={{ scale: 1 }}
//             transition={{ type: "spring", delay: 0.2 }}
//           >
//             <Leaf className="w-20 h-20 text-primary-foreground mx-auto mb-6" />
//           </motion.div>
//           <h1 className="font-display text-5xl font-bold text-primary-foreground mb-4">
//             FreshCart
//           </h1>
//           <p className="text-primary-foreground/80 text-lg max-w-sm mx-auto">
//             Farm-fresh vegetables and fruits delivered to your doorstep.
//           </p>
//         </div>
//       </div>

//       {/* Right panel */}
//       <div className="flex-1 flex items-center justify-center p-6 bg-background">
//         <motion.div
//           initial={{ opacity: 0, x: 30 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.5 }}
//           className="w-full max-w-md"
//         >
//           <div className="lg:hidden flex items-center gap-2 justify-center mb-8">
//             <Leaf className="w-8 h-8 text-primary" />
//             <span className="font-display text-3xl font-bold text-foreground">
//               Fresh<span className="text-accent">Cart</span>
//             </span>
//           </div>

//           <h2 className="font-display text-3xl font-bold text-foreground mb-2">
//             {isSignup
//               ? otpStep
//                 ? "Verify OTP"
//                 : "Create Account"
//               : "Welcome Back"}
//           </h2>

//           {error && (
//             <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
//               {error}
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-5">

//             {/* NAME */}
//             {isSignup && !otpStep && (
//               <div>
//                 <label className="block text-sm font-medium mb-1.5">
//                   Full Name
//                 </label>
//                 <input
//                   type="text"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   className="w-full px-4 py-3 bg-secondary rounded-xl"
//                 />
//               </div>
//             )}

//             {/* EMAIL */}
//             {!otpStep && (
//               <div>
//                 <label className="block text-sm font-medium mb-1.5">
//                   Email
//                 </label>
//                 <input
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="w-full px-4 py-3 bg-secondary rounded-xl"
//                 />
//               </div>
//             )}

//             {/* PASSWORD */}
//             {!otpStep && (
//               <div>
//                 <label className="block text-sm font-medium mb-1.5">
//                   Password
//                 </label>
//                 <div className="relative">
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     className="w-full px-4 py-3 bg-secondary rounded-xl pr-12"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3 top-1/2 -translate-y-1/2"
//                   >
//                     {showPassword ? (
//                       <EyeOff className="w-5 h-5" />
//                     ) : (
//                       <Eye className="w-5 h-5" />
//                     )}
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* OTP */}
//             {isSignup && otpStep && (
//               <div>
//                 <label className="block text-sm font-medium mb-1.5">
//                   Enter OTP
//                 </label>
//                 <input
//                   type="text"
//                   value={otp}
//                   onChange={(e) => setOtp(e.target.value)}
//                   className="w-full px-4 py-3 bg-secondary rounded-xl"
//                 />
//               </div>
//             )}

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full py-3.5 bg-primary text-primary-foreground font-bold rounded-full"
//             >
//               {loading
//                 ? "Please wait..."
//                 : isSignup
//                 ? otpStep
//                   ? "Verify OTP"
//                   : "Send OTP"
//                 : "Sign In"}
//             </button>
//           </form>

//           <p className="text-center text-sm mt-6">
//             {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
//             <button
//               onClick={() => {
//                 setIsSignup(!isSignup);
//                 setOtpStep(false);
//                 setError("");
//               }}
//               className="text-primary font-semibold hover:underline"
//             >
//               {isSignup ? "Sign In" : "Sign Up"}
//             </button>
//           </p>
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default Login;

// import { useState } from "react";
// import { useAuth } from "@/context/AuthContext";
// import { motion } from "framer-motion";
// import { Leaf, Eye, EyeOff } from "lucide-react";

// const Login = () => {
//   const { login, signup } = useAuth();
//   const [isSignup, setIsSignup] = useState(false);
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState("");

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");
//     if (!email || !password) return setError("Please fill in all fields");
//     if (isSignup && !name) return setError("Please enter your name");

//     if (isSignup) {
//       signup(name, email, password);
//     } else {
//       login(email, password);
//     }
//   };

//   return (
//     <div className="min-h-screen flex">
//       {/* Left panel */}
//       <div className="hidden lg:flex lg:w-1/2 bg-primary relative items-center justify-center overflow-hidden">
//         <div className="absolute inset-0 opacity-10">
//           {[...Array(6)].map((_, i) => (
//             <div key={i} className="absolute rounded-full bg-primary-foreground" style={{
//               width: `${80 + i * 40}px`, height: `${80 + i * 40}px`,
//               top: `${10 + i * 15}%`, left: `${5 + i * 12}%`, opacity: 0.1 + i * 0.05,
//             }} />
//           ))}
//         </div>
//         <div className="relative z-10 text-center px-12">
//           <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}>
//             <Leaf className="w-20 h-20 text-primary-foreground mx-auto mb-6" />
//           </motion.div>
//           <h1 className="font-display text-5xl font-bold text-primary-foreground mb-4">FreshCart</h1>
//           <p className="text-primary-foreground/80 text-lg max-w-sm mx-auto">
//             Farm-fresh vegetables and fruits delivered to your doorstep. Shop healthy, live happy.
//           </p>
//         </div>
//       </div>

//       {/* Right panel - form */}
//       <div className="flex-1 flex items-center justify-center p-6 bg-background">
//         <motion.div
//           initial={{ opacity: 0, x: 30 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.5 }}
//           className="w-full max-w-md"
//         >
//           <div className="lg:hidden flex items-center gap-2 justify-center mb-8">
//             <Leaf className="w-8 h-8 text-primary" />
//             <span className="font-display text-3xl font-bold text-foreground">
//               Fresh<span className="text-accent">Cart</span>
//             </span>
//           </div>

//           <h2 className="font-display text-3xl font-bold text-foreground mb-2">
//             {isSignup ? "Create Account" : "Welcome Back"}
//           </h2>
//           <p className="text-muted-foreground mb-8">
//             {isSignup ? "Sign up to start shopping fresh" : "Sign in to continue shopping"}
//           </p>

//           {error && (
//             <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">{error}</div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-5">
//             {isSignup && (
//               <div>
//                 <label className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
//                 <input
//                   type="text"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   placeholder="John Doe"
//                   className="w-full px-4 py-3 bg-secondary rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
//                 />
//               </div>
//             )}
//             <div>
//               <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="you@example.com"
//                 className="w-full px-4 py-3 bg-secondary rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
//               <div className="relative">
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   placeholder="••••••••"
//                   className="w-full px-4 py-3 bg-secondary rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all pr-12"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
//                 >
//                   {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//                 </button>
//               </div>
//             </div>
//             <button
//               type="submit"
//               className="w-full py-3.5 bg-primary text-primary-foreground font-bold rounded-full hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-lg"
//             >
//               {isSignup ? "Create Account" : "Sign In"}
//             </button>
//           </form>

//           <p className="text-center text-sm text-muted-foreground mt-6">
//             {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
//             <button
//               onClick={() => { setIsSignup(!isSignup); setError(""); }}
//               className="text-primary font-semibold hover:underline"
//             >
//               {isSignup ? "Sign In" : "Sign Up"}
//             </button>
//           </p>
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default Login;

