import React from "react";
import {
  MessageSquare,
  Mail,
  Monitor,
  Smartphone,
  Target,
  TrendingUp,
  Search,
  Download,
  Play,
  Eye,
  Share2,
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
  PieChart,
  Pie,
  Cell,
} from "recharts";

const MarketingInsights = ({ marketingData }) => {
  const [search, setSearch] = React.useState("");
  const [selectedProduct, setSelectedProduct] = React.useState("");
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const { alert, showSuccess, showInfo, hideAlert } = useAlert();

  // Get unique product names for dropdown
  const productNames = Array.from(new Set(marketingData.map((p) => p.product)));

  // Filtered data based on search or selected product
  const filteredData = selectedProduct
    ? marketingData.filter((p) => p.product === selectedProduct)
    : search
    ? marketingData.filter((p) =>
        p.product.toLowerCase().includes(search.toLowerCase())
      )
    : marketingData;

  // For product details display logic
  const [visibleCount, setVisibleCount] = React.useState(4);
  let productDetailsToShow = [];
  if (selectedProduct) {
    productDetailsToShow = filteredData;
  } else {
    productDetailsToShow = filteredData.slice(0, visibleCount);
  }

  const launchCampaign = (product, channel) => {
    const campaignDetails = `Launch Marketing Campaign:

Product: ${product.product}
Channel: ${channel.name}
Message: "${product.optimalMessage}"
Expected ROI: ${channel.roi}
Estimated Cost: ${channel.cost}
Effectiveness Score: ${channel.effectiveness}%

This campaign is projected to generate excellent returns based on AI analysis.`;

    showConfirm(
      campaignDetails,
      () => {
        showSuccess(
          `Campaign launched successfully for ${product.product} on ${channel.name}!`,
          "Campaign Launched"
        );
      },
      "Launch Campaign"
    );
  };

  const downloadMarketingReport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Product,Optimal Message,Channel,Effectiveness,Cost,ROI\n" +
      filteredData
        .flatMap((product) =>
          product.channels.map(
            (channel) =>
              `"${product.product}","${product.optimalMessage}","${channel.name}",${channel.effectiveness},"${channel.cost}","${channel.roi}"`
          )
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "marketing_insights_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const previewCampaign = (product, channel) => {
    showInfo(
      `Product: ${product.product}\nChannel: ${channel.name}\nMessage: "${product.optimalMessage}"\n\nThis preview shows how your campaign will appear to customers across ${channel.name} with an expected effectiveness of ${channel.effectiveness}%.`,
      "Campaign Preview"
    );
  };

  const getChannelIcon = (channelName) => {
    switch (channelName.toLowerCase()) {
      case "social media":
        return <MessageSquare className="h-5 w-5" />;
      case "email marketing":
        return <Mail className="h-5 w-5" />;
      case "in-store display":
        return <Monitor className="h-5 w-5" />;
      case "digital ads":
        return <Smartphone className="h-5 w-5" />;
      default:
        return <Target className="h-5 w-5" />;
    }
  };

  const getEffectivenessColor = (effectiveness) => {
    if (effectiveness >= 85) return "bg-green-500";
    if (effectiveness >= 70) return "bg-blue-500";
    if (effectiveness >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const chartColors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

  const allChannelsData = filteredData.flatMap((product) =>
    product.channels.map((channel) => ({
      name: channel.name,
      effectiveness: channel.effectiveness,
      roi: parseInt(channel.roi.replace("%", "")),
      cost: parseInt(channel.cost.replace(/[$,]/g, "")),
    }))
  );

  // Group by channel and average effectiveness
  const channelEffectiveness = allChannelsData.reduce((acc, channel) => {
    if (!acc[channel.name]) {
      acc[channel.name] = { total: 0, count: 0 };
    }
    acc[channel.name].total += channel.effectiveness;
    acc[channel.name].count += 1;
    return acc;
  }, {});

  const chartData = Object.entries(channelEffectiveness).map(
    ([name, data]) => ({
      name: name.split(" ")[0],
      effectiveness: Math.round(data.total / data.count),
    })
  );

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
    <section className="py-20 bg-white w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Revolutionize Your Marketing
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover which marketing channels and messages drive the best
            results for each product. Optimize your marketing spend with
            data-driven insights.
          </p>
        </motion.div>

        {/* Search and Controls */}
        <motion.div
          className="mb-8 bg-gray-50 rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col md:flex-row items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search product..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setSelectedProduct("");
                  }}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={selectedProduct}
                onChange={(e) => {
                  setSelectedProduct(e.target.value);
                  setSearch("");
                }}
                className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-64 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Products</option>
                {productNames.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
            <motion.button
              onClick={downloadMarketingReport}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download className="h-4 w-4" />
              <span>Export Report</span>
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          className="grid lg:grid-cols-2 gap-12 mb-16"
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <motion.div
            className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-8 hover:shadow-lg transition-all duration-300"
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Channel Effectiveness
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                <XAxis dataKey="name" stroke="#3730a3" />
                <YAxis stroke="#3730a3" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #3b82f6",
                    borderRadius: "12px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Bar
                  dataKey="effectiveness"
                  fill="#3b82f6"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div className="space-y-6" variants={containerVariants}>
            <motion.div
              className="bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl p-6 text-white hover:shadow-lg transition-all duration-300"
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -3 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-green-100">Best Performing Channel</div>
                  <div className="text-2xl font-bold">In-Store Display</div>
                </div>
                <motion.div
                  className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Monitor className="h-6 w-6" />
                </motion.div>
              </div>
              <div className="flex justify-between">
                <div>
                  <div className="text-green-100 text-sm">
                    Avg. Effectiveness
                  </div>
                  <div className="font-bold text-xl">84%</div>
                </div>
                <div>
                  <div className="text-green-100 text-sm">Avg. ROI</div>
                  <div className="font-bold text-xl">311%</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="grid grid-cols-2 gap-4"
              variants={containerVariants}
            >
              <motion.div
                className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors"
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-gray-600 text-sm">Total Channels</div>
                <div className="text-2xl font-bold text-gray-900">4</div>
              </motion.div>
              <motion.div
                className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors"
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-gray-600 text-sm">Avg. ROI</div>
                <div className="text-2xl font-bold text-green-600">278%</div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          className="space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {productDetailsToShow.map((product, productIndex) => (
            <motion.div
              key={productIndex}
              className="bg-gray-50 rounded-3xl p-8 hover:shadow-lg transition-all duration-300"
              variants={itemVariants}
              whileHover={{ scale: 1.01, y: -3 }}
            >
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {product.product}
                </h3>
                <motion.div
                  className="bg-blue-100 rounded-xl p-4 inline-block hover:bg-blue-200 transition-colors cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  onClick={() =>
                    showInfo(
                      `"${product.optimalMessage}"\n\nThis message has been optimized using AI analysis of customer behavior and engagement patterns.`,
                      "Full Message Preview"
                    )
                  }
                >
                  <div className="text-blue-800 text-sm font-medium">
                    Optimal Message (Click to preview)
                  </div>
                  <div className="text-blue-900 font-semibold">
                    "{product.optimalMessage}"
                  </div>
                </motion.div>
              </div>

              <motion.div
                className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
                variants={containerVariants}
              >
                {product.channels.map((channel, channelIndex) => (
                  <motion.div
                    key={channelIndex}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group"
                    variants={itemVariants}
                    whileHover={{ scale: 1.03, y: -5 }}
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <motion.div
                        className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 group-hover:bg-blue-200 transition-colors"
                        whileHover={{ rotateY: 180 }}
                        transition={{ duration: 0.6 }}
                      >
                        {getChannelIcon(channel.name)}
                      </motion.div>
                      <div className="font-semibold text-gray-900">
                        {channel.name}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-600 text-sm">
                            Effectiveness
                          </span>
                          <span className="font-bold text-gray-900">
                            {channel.effectiveness}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <motion.div
                            className={`h-2 rounded-full ${getEffectivenessColor(
                              channel.effectiveness
                            )}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${channel.effectiveness}%` }}
                            transition={{
                              duration: 1,
                              delay: channelIndex * 0.1,
                            }}
                          ></motion.div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                        <div>
                          <div className="text-gray-500 text-xs">Cost</div>
                          <div className="font-bold text-gray-900">
                            {channel.cost}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500 text-xs">ROI</div>
                          <div className="font-bold text-green-600">
                            {channel.roi}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-2 pt-2">
                        <motion.button
                          onClick={() => previewCampaign(product, channel)}
                          className="flex-1 bg-gray-100 text-gray-700 py-1 px-2 rounded text-xs hover:bg-gray-200 transition-colors flex items-center justify-center space-x-1"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Eye className="h-3 w-3" />
                          <span>Preview</span>
                        </motion.button>
                        <motion.button
                          onClick={() => launchCampaign(product, channel)}
                          className="flex-1 bg-blue-600 text-white py-1 px-2 rounded text-xs hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Play className="h-3 w-3" />
                          <span>Launch</span>
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          ))}

          {!selectedProduct && filteredData.length > visibleCount && (
            <div className="flex justify-center mt-8">
              <motion.button
                className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
                onClick={() => setVisibleCount((prev) => prev + 4)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Show More Products ({filteredData.length - visibleCount}{" "}
                remaining)
              </motion.button>
            </div>
          )}

          {filteredData.length === 0 && (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Target className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No marketing data found
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

export default MarketingInsights;
