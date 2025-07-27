import React from "react";
import {
  TrendingUp,
  BarChart3,
  Target,
  ArrowRight,
  LogOut,
  User,
} from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import CustomAlert from "./CustomAlert";
import { useAlert } from "../hooks/useAlert";

const Hero = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const { alert, showConfirm, showInfo, hideAlert } = useAlert();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const handleViewDashboard = () => {
    // Smooth scroll to dashboard content
    const dashboardElement = document.querySelector(
      '[data-section="dashboard"]'
    );
    if (dashboardElement) {
      dashboardElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleLearnMore = () => {
    // Scroll to about section or show info modal
    const aboutElement = document.querySelector('[data-section="about"]');
    if (aboutElement) {
      aboutElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      // Show an informational modal or alert if about section doesn't exist
      showInfo(
        "Welcome to our AI-powered retail analytics platform! Discover trending products, optimize pricing, and get marketing insights to boost your business.",
        "Welcome to Walmart Analytics"
      );
    }
  };

  const handleLogout = () => {
    showConfirm(
      "Are you sure you want to logout? You will need to sign in again to access the dashboard.",
      () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/auth";
      },
      "Confirm Logout"
    );
  };

  const getUserName = () => {
    try {
      // First try to get user data from localStorage
      const userData = localStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        return user.name || user.email || "User";
      }

      // Fallback to JWT token if user data not available
      const token = localStorage.getItem("token");
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.name || payload.email || "User";
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
    return "User";
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
      {/* Animated background particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, Math.random() * 50 - 25, 0],
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

      {/* User profile and logout button */}
      <div className="absolute top-4 right-4 z-10">
        <div className="flex items-center space-x-4">
          <motion.div
            className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <User className="h-4 w-4" />
            <span className="text-sm font-medium">{getUserName()}</span>
          </motion.div>
          <motion.button
            onClick={handleLogout}
            className="bg-red-500/20 hover:bg-red-500/30 backdrop-blur-sm rounded-lg p-2 transition-all duration-300 group"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <LogOut className="h-4 w-4 group-hover:text-red-200 transition-colors" />
          </motion.button>
        </div>
      </div>

      <div className="absolute inset-0 bg-black opacity-10"></div>
      <motion.div
        ref={ref}
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24"
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <motion.div variants={itemVariants} className="space-y-4">
              <motion.h1
                className="text-5xl lg:text-6xl font-bold leading-tight"
                variants={itemVariants}
              >
                Discover the
                <motion.div
                  className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500"
                  animate={{
                    backgroundPosition: ["0%", "100%", "0%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  Trending
                </motion.div>
              </motion.h1>
              <motion.p
                className="text-xl text-blue-100 leading-relaxed"
                variants={itemVariants}
              >
                Harness the power of ML to predict product trends, optimize
                pricing, and maximize sales while minimizing waste. Transform
                your retail strategy with data-driven insights.
              </motion.p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.button
                onClick={handleViewDashboard}
                className="group bg-white text-blue-800 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                View Dashboard
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <motion.button
                onClick={handleLearnMore}
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-800 transition-all duration-300 hover:shadow-lg"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
              </motion.button>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="grid grid-cols-3 gap-8 pt-8"
            >
              <motion.div
                className="text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div
                  className="text-3xl font-bold text-yellow-400"
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  92%
                </motion.div>
                <div className="text-blue-200 text-sm">Prediction Accuracy</div>
              </motion.div>
              <motion.div
                className="text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div
                  className="text-3xl font-bold text-green-400"
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                >
                  31%
                </motion.div>
                <div className="text-blue-200 text-sm">Waste Reduction</div>
              </motion.div>
              <motion.div
                className="text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div
                  className="text-3xl font-bold text-orange-400"
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                >
                  387%
                </motion.div>
                <div className="text-blue-200 text-sm">Max ROI</div>
              </motion.div>
            </motion.div>
          </div>

          <motion.div variants={itemVariants} className="relative">
            <motion.div
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-6">
                <motion.div
                  className="flex items-center justify-between"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 }}
                >
                  <div className="flex items-center space-x-3">
                    <motion.div
                      className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center"
                      animate={{
                        rotateY: [0, 360],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <TrendingUp className="h-6 w-6 text-white" />
                    </motion.div>
                    <div>
                      <div className="font-semibold">Live Trend Analysis</div>
                      <div className="text-blue-200 text-sm">
                        Real-time insights
                      </div>
                    </div>
                  </div>
                  <motion.div
                    className="text-green-400 font-bold"
                    animate={{
                      color: ["#10b981", "#22c55e", "#10b981"],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  >
                    +23%
                  </motion.div>
                </motion.div>

                <motion.div
                  className="space-y-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-blue-200">Organic Avocados</span>
                    <span className="text-white font-semibold">Score: 92</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: "92%" }}
                      transition={{
                        delay: 1.5,
                        duration: 1.5,
                        ease: "easeOut",
                      }}
                    ></motion.div>
                  </div>
                </motion.div>

                <motion.div
                  className="space-y-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4 }}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-blue-200">Greek Yogurt</span>
                    <span className="text-white font-semibold">Score: 88</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: "88%" }}
                      transition={{
                        delay: 1.7,
                        duration: 1.5,
                        ease: "easeOut",
                      }}
                    ></motion.div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
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
    </section>
  );
};

export default Hero;
