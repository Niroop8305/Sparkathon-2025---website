import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Lock, Eye, EyeOff, Loader } from "lucide-react";
import CustomAlert from "../components/CustomAlert";
import { useAlert } from "../hooks/useAlert";
import { API_BASE_URL } from "../config/api";

function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const location = useLocation();
  const { alert, showSuccess, showError, showInfo, hideAlert } = useAlert();

  // Only redirect to dashboard if on /auth and authenticated
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && location.pathname === "/auth") {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate, location]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      showSuccess(
        res.data.msg + " You can now sign in!",
        "Registration Successful"
      );
      setIsSignUp(false);
      setFormData({ name: "", email: "", password: "" });
    } catch (err) {
      showError(
        err.response?.data?.msg || "Signup error",
        "Registration Failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: formData.email,
        password: formData.password,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      localStorage.removeItem("token"); // Clear any invalid token
      localStorage.removeItem("user"); // Clear any invalid user data
      showError(err.response?.data?.msg || "Login error", "Login Failed");
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const formVariants = {
    hidden: { opacity: 0, x: isSignUp ? 20 : -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 100 - 50, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <motion.div
        className="w-full max-w-md bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="flex flex-col items-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* Walmart logo */}
          <motion.img
            src="/walmart-logo.png"
            alt="Walmart"
            className="h-16 mb-4"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          />
          <motion.h2
            className="text-3xl font-bold text-gray-900 mb-2 text-center"
            key={isSignUp ? "signup" : "signin"}
            variants={formVariants}
            initial="hidden"
            animate="visible"
          >
            {isSignUp ? "Create Account" : "Welcome Back"}
          </motion.h2>
          <motion.p
            className="text-gray-600 text-sm text-center"
            key={isSignUp ? "signup-desc" : "signin-desc"}
            variants={formVariants}
            initial="hidden"
            animate="visible"
          >
            {isSignUp
              ? "Join our AI-powered retail analytics platform"
              : "Sign in to access your retail insights"}
          </motion.p>
        </motion.div>

        <motion.form
          onSubmit={isSignUp ? handleSignUp : handleSignIn}
          className="space-y-6"
          key={isSignUp ? "signup-form" : "signin-form"}
          variants={formVariants}
          initial="hidden"
          animate="visible"
        >
          {isSignUp && (
            <motion.div
              className="relative"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </motion.div>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          <motion.button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
          >
            {isLoading && <Loader className="h-5 w-5 animate-spin" />}
            <span>
              {isLoading
                ? "Processing..."
                : isSignUp
                ? "Create Account"
                : "Sign In"}
            </span>
          </motion.button>
        </motion.form>

        <motion.div
          className="flex flex-col items-center mt-8 space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            className="text-blue-600 hover:text-blue-800 text-sm font-semibold focus:outline-none transition-colors"
            onClick={() => {
              setIsSignUp((prev) => !prev);
              setFormData({ name: "", email: "", password: "" });
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isSignUp
              ? "Already have an account? Sign in"
              : "New to our platform? Create an account"}
          </motion.button>

          {!isSignUp && (
            <motion.a
              className="text-blue-500 text-xs underline hover:text-blue-700 transition-colors"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                showInfo(
                  "Password reset functionality would be implemented here. Please contact support for assistance.",
                  "Password Reset"
                );
              }}
              whileHover={{ scale: 1.05 }}
            >
              Forgot your password?
            </motion.a>
          )}
        </motion.div>

        {/* Demo credentials hint for testing */}
        <motion.div
          className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <p className="text-blue-800 text-xs text-center mb-2">
            <strong>Demo Access:</strong> Create a new account or use test
            credentials
          </p>
          <motion.button
            onClick={() =>
              showInfo(
                "You can use these credentials to quickly test the application without creating a new account.\n\nEmail: admin@example.com\nPassword: admin123",
                "Test Credentials"
              )
            }
            className="w-full text-blue-600 hover:text-blue-800 text-xs underline transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Click here for test credentials
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Custom Alert */}
      <CustomAlert
        isOpen={alert.isOpen}
        onClose={hideAlert}
        title={alert.title}
        message={alert.message}
        type={alert.type}
        onConfirm={alert.onConfirm}
        onCancel={alert.onCancel}
        showConfirmButton={alert.showConfirmButton}
        showCancelButton={alert.showCancelButton}
        autoClose={alert.autoClose}
        autoCloseDelay={alert.autoCloseDelay}
        confirmText={alert.confirmText}
        cancelText={alert.cancelText}
      />
    </div>
  );
}

export default Auth;
