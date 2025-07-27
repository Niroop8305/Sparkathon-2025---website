import React from "react";
import {
  DollarSign,
  TrendingUp,
  Zap,
  Leaf,
  Calculator,
  Download,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import CustomAlert from "./CustomAlert";
import { useAlert } from "../hooks/useAlert";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const PricingOptimization = ({ products }) => {
  const [visibleCount, setVisibleCount] = React.useState(6);
  const [selectedProduct, setSelectedProduct] = React.useState(null);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const { alert, showConfirm, showSuccess, hideAlert } = useAlert();

  const visibleProducts = products.slice(0, visibleCount);

  const chartData = visibleProducts.map((product) => {
    let waste = product.wasteReduction;
    if (typeof waste === "string" && waste.includes("%")) {
      waste = parseFloat(waste.replace("%", ""));
    } else if (!isNaN(Number(waste))) {
      waste = Number(waste);
    } else {
      waste = 0;
    }
    return {
      name: (product.name || "").split(" ")[0],
      current: Number(product.currentPrice) || 0,
      optimal: Number(product.optimalPrice) || 0,
      sales: Number(product.expectedSales) / 100 || 0,
      waste,
    };
  });

  const totalWasteReduction =
    visibleProducts.reduce((sum, product) => {
      let waste = product.wasteReduction;
      if (typeof waste === "string" && waste.includes("%")) {
        waste = parseFloat(waste.replace("%", ""));
      } else if (!isNaN(Number(waste))) {
        waste = Number(waste);
      } else {
        waste = 0;
      }
      return sum + waste;
    }, 0) / (visibleProducts.length || 1);

  const totalSalesIncrease = visibleProducts.reduce(
    (sum, product) => sum + product.expectedSales,
    0
  );

  const calculatePotentialSavings = (product) => {
    const priceDiff = product.currentPrice - product.optimalPrice;
    const savings = (priceDiff * product.expectedSales * 0.1).toFixed(2);
    return parseFloat(savings);
  };

  const downloadPricingReport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Product Name,Current Price,Optimal Price,Price Difference,Expected Sales,Waste Reduction,Revenue Impact\n" +
      visibleProducts
        .map((product) => {
          const priceDiff = (
            product.currentPrice - product.optimalPrice
          ).toFixed(2);
          const revenueImpact = calculatePotentialSavings(product);
          return `"${product.name}",${product.currentPrice},${product.optimalPrice},${priceDiff},${product.expectedSales},"${product.wasteReduction}",${revenueImpact}`;
        })
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "pricing_optimization_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const applyOptimalPricing = (product) => {
    const savings = calculatePotentialSavings(product);
    const message = `Apply Optimal Pricing for ${
      product.name
    }?\n\nCurrent Price: $${product.currentPrice}\nOptimal Price: $${
      product.optimalPrice
    }\nPotential Monthly Savings: $${Math.abs(savings)}\nWaste Reduction: ${
      product.wasteReduction
    }\n\nThis will help ${
      savings > 0 ? "reduce costs and waste" : "increase revenue"
    }.`;

    showConfirm(
      message,
      () => {
        showSuccess(
          `Optimal pricing applied for ${product.name}! Price updated to $${product.optimalPrice}`,
          "Pricing Updated"
        );
      },
      "Apply Optimal Pricing"
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Optimize Your Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            AI-powered pricing strategies that maximize revenue while reducing
            food waste. Find the perfect balance between profitability and
            sustainability.
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="mb-8 bg-white rounded-2xl p-6 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.div
                className="bg-green-100 p-3 rounded-lg"
                whileHover={{ scale: 1.05 }}
              >
                <CheckCircle className="h-6 w-6 text-green-600" />
              </motion.div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Pricing Optimization Ready
                </h3>
                <p className="text-gray-600 text-sm">
                  {visibleProducts.length} products analyzed with AI
                  recommendations
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={() => {
                  const totalSavings = visibleProducts
                    .reduce(
                      (sum, p) => sum + Math.abs(calculatePotentialSavings(p)),
                      0
                    )
                    .toFixed(2);

                  showConfirm(
                    `Bulk Apply Pricing:\n\nThis would apply optimal pricing to all ${
                      visibleProducts.length
                    } products.\n\nEstimated Total Monthly Savings: $${totalSavings}\n\nAverage Waste Reduction: ${totalWasteReduction.toFixed(
                      1
                    )}%`,
                    () => {
                      showSuccess(
                        `Optimal pricing applied to all ${visibleProducts.length} products! Total estimated monthly savings: $${totalSavings}`,
                        "Bulk Pricing Applied"
                      );
                    },
                    "Apply Bulk Pricing"
                  );
                }}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Calculator className="h-4 w-4" />
                <span>Apply All</span>
              </motion.button>
              <motion.button
                onClick={downloadPricingReport}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download className="h-4 w-4" />
                <span>Export Report</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="grid lg:grid-cols-3 gap-8 mb-12"
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <div className="lg:col-span-2">
            <motion.div
              className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300"
              variants={itemVariants}
              whileHover={{ scale: 1.01, y: -5 }}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Current vs Optimal Pricing
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e5e5",
                      borderRadius: "12px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Bar
                    dataKey="current"
                    fill="#3b82f6"
                    name="Current Price"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="optimal"
                    fill="#10b981"
                    name="Optimal Price"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          <motion.div className="space-y-6" variants={containerVariants}>
            <motion.div
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300"
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -3 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <motion.div
                  className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Leaf className="h-6 w-6 text-green-600" />
                </motion.div>
                <div>
                  <div className="font-bold text-gray-900">Waste Reduction</div>
                  <motion.div
                    className="text-green-600 font-bold text-2xl"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                  >
                    {totalWasteReduction.toFixed(1)}%
                  </motion.div>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                Average waste reduction across all optimized products
              </p>
            </motion.div>

            <motion.div
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300"
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -3 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <motion.div
                  className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </motion.div>
                <div>
                  <div className="font-bold text-gray-900">Sales Boost</div>
                  <motion.div
                    className="text-blue-600 font-bold text-2xl"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.7, type: "spring" }}
                  >
                    {(totalSalesIncrease / 1000).toFixed(1)}K
                  </motion.div>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                Expected additional units sold monthly
              </p>
            </motion.div>

            <motion.div
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300"
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -3 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <motion.div
                  className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Zap className="h-6 w-6 text-purple-600" />
                </motion.div>
                <div>
                  <div className="font-bold text-gray-900">ROI Impact</div>
                  <motion.div
                    className="text-purple-600 font-bold text-2xl"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.9, type: "spring" }}
                  >
                    +287%
                  </motion.div>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                Average return on investment improvement
              </p>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-8">
            Product Pricing Details
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">
                    Product
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">
                    Current Price
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">
                    Optimal Price
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">
                    Change
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">
                    Waste Reduction
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {visibleProducts.map((product, index) => (
                  <motion.tr
                    key={product.id || product.name || index}
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? "bg-gray-25" : "bg-white"
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <td className="py-4 px-6">
                      <div>
                        <div className="font-semibold text-gray-900">
                          {product.name}
                        </div>
                        <div className="text-gray-500 text-sm">
                          {product.category}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-semibold text-gray-900">
                      ${Number(product.currentPrice).toFixed(2)}
                    </td>
                    <td className="py-4 px-6 font-semibold text-green-600">
                      ${Number(product.optimalPrice).toFixed(2)}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`font-semibold ${
                          product.currentPrice > product.optimalPrice
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {product.currentPrice > product.optimalPrice
                          ? "-"
                          : "+"}
                        $
                        {Math.abs(
                          product.currentPrice - product.optimalPrice
                        ).toFixed(2)}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-semibold text-green-600">
                      {product.wasteReduction}
                    </td>
                    <td className="py-4 px-6">
                      <motion.button
                        onClick={() => applyOptimalPricing(product)}
                        className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center space-x-1"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Calculator className="h-3 w-3" />
                        <span>Apply</span>
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {products.length > visibleCount && (
              <div className="flex justify-center mt-8">
                <motion.button
                  className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
                  onClick={() => setVisibleCount((prev) => prev + 6)}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Show More Products ({products.length - visibleCount}{" "}
                  remaining)
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
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

export default PricingOptimization;
