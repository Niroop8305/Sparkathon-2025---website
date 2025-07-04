import React from "react";

const navItems = [
  { label: "Product Trends", key: "productTrends" },
  { label: "Pricing Optimization", key: "pricingOptimization" },
  { label: "Marketing Insights", key: "marketingInsights" },
];

function NavBar({ selected, onSelect }) {
  return (
    <nav className="flex w-full space-x-4 bg-white shadow px-6 py-3 rounded-lg justify-center">
      {navItems.map((item) => (
        <button
          key={item.key}
          className={`px-4 py-2 rounded transition-colors font-semibold ${
            selected === item.key
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-blue-100"
          }`}
          onClick={() => onSelect(item.key)}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}

export default NavBar;
