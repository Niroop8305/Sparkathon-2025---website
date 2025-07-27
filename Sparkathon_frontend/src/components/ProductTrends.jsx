import React from "react";
import {
  TrendingUp,
  Package,
  Target,
  BarChart3,
  Search,
  Filter,
  Eye,
  Download,
  Heart,
} from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import CustomAlert from "./CustomAlert";
import { useAlert } from "../hooks/useAlert";

const ProductTrends = ({ products }) => {
  const [visibleCount, setVisibleCount] = React.useState(6);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [sortBy, setSortBy] = React.useState("trendScore");
  const [favorites, setFavorites] = React.useState(new Set());
  const { alert, showInfo, hideAlert } = useAlert();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Filter and sort products
  const filteredProducts = products
    .filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "trendScore":
          return b.trendScore - a.trendScore;
        case "expectedSales":
          return b.expectedSales - a.expectedSales;
        case "confidence":
          return b.confidence - a.confidence;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  const toggleFavorite = (productName) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(productName)) {
      newFavorites.delete(productName);
    } else {
      newFavorites.add(productName);
    }
    setFavorites(newFavorites);
  };

  const downloadReport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Product Name,Trend Score,Expected Sales,Confidence,Trend Label\n" +
      filteredProducts
        .map(
          (product) =>
            `"${product.name}",${product.trendScore},${product.expectedSales},${
              product.confidence
            },"${product.trendLabel || product.predictedLabel || "N/A"}"`
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "product_trends_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const viewProductDetails = (product) => {
    const recommendationLevel =
      product.trendScore >= 80
        ? "highly recommended"
        : product.trendScore >= 60
        ? "moderately recommended"
        : "low priority";

    showInfo(
      `Name: ${product.name}\nTrend Score: ${
        product.trendScore
      }/100\nExpected Sales: ${product.expectedSales.toLocaleString()}\nConfidence: ${
        product.confidence
      }%\nTrend Label: ${
        product.trendLabel || product.predictedLabel || "N/A"
      }\n\nThis product is ${recommendationLevel} for stocking.`,
      "Product Details"
    );
  };

  // Accepts trendLabel or predictedLabel, fallback to empty string
  const getDemandColor = (demand) => {
    if (!demand) return "text-gray-600 bg-gray-100";
    switch (demand.toLowerCase()) {
      case "high":
        return "text-green-600 bg-green-100";
      case "medium-high":
        return "text-blue-600 bg-blue-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getScoreColor = (score) => {
    if (score >= 85) return "from-green-500 to-emerald-600";
    if (score >= 70) return "from-blue-500 to-blue-600";
    return "from-yellow-500 to-orange-600";
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
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Predict Product Trends
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our ML algorithms analyze market data, seasonal patterns, and
            consumer behavior to predict which perishable products will trend in
            the coming weeks.
          </p>
        </motion.div>

        {/* Search and Filter Controls */}
        <motion.div
          className="mb-8 bg-gray-50 rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="trendScore">Trend Score</option>
                  <option value="expectedSales">Expected Sales</option>
                  <option value="confidence">Confidence</option>
                  <option value="name">Name</option>
                </select>
              </div>
              <motion.button
                onClick={downloadReport}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download className="h-4 w-4" />
                <span>Export</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 border border-blue-200 hover:shadow-lg transition-all duration-300"
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <motion.div
              className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6"
              whileHover={{ rotateY: 180 }}
              transition={{ duration: 0.6 }}
            >
              <BarChart3 className="h-8 w-8 text-white" />
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Advanced Analytics
            </h3>
            <p className="text-gray-600">
              Machine learning models process thousands of data points to
              identify emerging trends before they become mainstream.
            </p>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 border border-green-200 hover:shadow-lg transition-all duration-300"
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <motion.div
              className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mb-6"
              whileHover={{ rotateY: 180 }}
              transition={{ duration: 0.6 }}
            >
              <Target className="h-8 w-8 text-white" />
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Demand Prediction
            </h3>
            <p className="text-gray-600">
              Accurate forecasting helps you stock the right products at the
              right time, reducing waste and maximizing profits.
            </p>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 border border-purple-200 md:col-span-2 lg:col-span-1 hover:shadow-lg transition-all duration-300"
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <motion.div
              className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mb-6"
              whileHover={{ rotateY: 180 }}
              transition={{ duration: 0.6 }}
            >
              <Package className="h-8 w-8 text-white" />
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Category Intelligence
            </h3>
            <p className="text-gray-600">
              Get insights across all product categories from produce to
              prepared foods, dairy to seafood.
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          className="bg-gray-50 rounded-3xl p-8"
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Current Trending Products ({filteredProducts.length} found)
          </h3>

          <motion.div
            className="grid lg:grid-cols-2 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            {visibleProducts.map((product, idx) => (
              <motion.div
                key={product.id || product.name || idx}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 relative group"
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -5 }}
                layout
              >
                {/* Favorite button */}
                <motion.button
                  onClick={() => toggleFavorite(product.name)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-red-100 transition-colors group z-10"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Heart
                    className={`h-5 w-5 ${
                      favorites.has(product.name)
                        ? "text-red-500 fill-current"
                        : "text-gray-400 group-hover:text-red-500"
                    }`}
                  />
                </motion.button>

                <div className="flex items-start justify-between mb-4 pr-12">
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">
                      {product.name}
                    </h4>
                    {/* Category may not exist in new data */}
                    <p className="text-gray-600">{product.category || ""}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getDemandColor(
                      product.trendLabel || product.predictedLabel || ""
                    )}`}
                  >
                    {product.trendLabel || product.predictedLabel || "N/A"}
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Trend Score</span>
                      <span className="font-bold text-gray-900">
                        {product.trendScore}/100
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <motion.div
                        className={`h-3 rounded-full bg-gradient-to-r ${getScoreColor(
                          product.trendScore
                        )}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${product.trendScore}%` }}
                        transition={{ duration: 1, delay: idx * 0.1 }}
                      ></motion.div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                    <div>
                      <div className="text-sm text-gray-500">
                        Expected Sales
                      </div>
                      <div className="font-bold text-gray-900">
                        {product.expectedSales.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Confidence</div>
                      <div className="font-bold text-gray-900">
                        {product.confidence}%
                      </div>
                    </div>
                  </div>

                  {/* Action button */}
                  <motion.button
                    onClick={() => viewProductDetails(product)}
                    className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Eye className="h-4 w-4" />
                    <span>View Details</span>
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {filteredProducts.length > visibleCount && (
            <div className="flex justify-center mt-8">
              <motion.button
                className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
                onClick={() => setVisibleCount((prev) => prev + 6)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Show More Products ({filteredProducts.length - visibleCount}{" "}
                remaining)
              </motion.button>
            </div>
          )}

          {filteredProducts.length === 0 && (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No products found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search criteria
              </p>
            </motion.div>
          )}
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

export default ProductTrends;
