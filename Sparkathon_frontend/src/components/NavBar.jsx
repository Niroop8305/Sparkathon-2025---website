import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, DollarSign, Target } from "lucide-react";

const navItems = [
  {
    label: "Product Trends",
    key: "productTrends",
    icon: TrendingUp,
    description: "Discover trending products with AI-powered predictions",
  },
  {
    label: "Pricing Optimization",
    key: "pricingOptimization",
    icon: DollarSign,
    description: "Optimize pricing strategies to maximize profits",
  },
  {
    label: "Marketing Insights",
    key: "marketingInsights",
    icon: Target,
    description: "Get data-driven marketing recommendations",
  },
];

function NavBar({ selected, onSelect }) {
  return (
    <nav className="flex w-full space-x-4 bg-white shadow-lg px-6 py-4 rounded-2xl justify-center mx-4 my-8 backdrop-blur-sm bg-white/95">
      {navItems.map((item, index) => {
        const IconComponent = item.icon;
        return (
          <motion.button
            key={item.key}
            className={`relative px-6 py-3 rounded-xl transition-all duration-300 font-semibold flex items-center space-x-2 group ${
              selected === item.key
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-gray-50 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            }`}
            onClick={() => onSelect(item.key)}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <IconComponent className="h-5 w-5" />
            <span className="hidden sm:inline">{item.label}</span>

            {/* Tooltip */}
            <motion.div
              className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10"
              initial={{ opacity: 0, y: 10 }}
              whileHover={{ opacity: 1, y: 0 }}
            >
              {item.description}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
            </motion.div>

            {/* Active indicator */}
            {selected === item.key && (
              <motion.div
                className="absolute inset-0 bg-blue-600 rounded-xl -z-10"
                layoutId="activeTab"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </motion.button>
        );
      })}
    </nav>
  );
}

export default NavBar;
