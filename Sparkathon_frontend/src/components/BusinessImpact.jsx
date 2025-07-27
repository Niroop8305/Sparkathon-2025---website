import React from "react";
import {
  TrendingUp,
  DollarSign,
  Leaf,
  Users,
  ArrowUp,
  ArrowDown,
  Calendar,
  Download,
  Share2,
  PlayCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import CustomAlert from "./CustomAlert";
import { useAlert } from "../hooks/useAlert";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

const BusinessImpact = ({ products }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const { alert, showSuccess, showInfo, hideAlert } = useAlert();

  // Calculate business metrics
  const totalRevenue = products.reduce(
    (sum, product) =>
      sum +
      (Number(product.optimalPrice) || 0) *
        (Number(product.expectedSales) || 0),
    0
  );

  // wasteReduction may be a number (stock left) or a string ("15%"), handle both
  const totalWasteReduction =
    products.reduce((sum, product) => {
      const waste = product.wasteReduction;
      if (typeof waste === "string" && waste.includes("%")) {
        return sum + parseFloat(waste.replace("%", ""));
      } else if (!isNaN(Number(waste))) {
        return sum + Number(waste);
      }
      return sum;
    }, 0) / (products.length || 1);

  const averageConfidence =
    products.reduce(
      (sum, product) => sum + (Number(product.confidence) || 0),
      0
    ) / (products.length || 1);

  // Mock historical data for charts
  const revenueData = [
    { month: "Jan", current: 45000, optimized: 52000 },
    { month: "Feb", current: 48000, optimized: 58000 },
    { month: "Mar", current: 42000, optimized: 51000 },
    { month: "Apr", current: 50000, optimized: 62000 },
    { month: "May", current: 55000, optimized: 68000 },
    { month: "Jun", current: 58000, optimized: 72000 },
  ];

  const wasteData = [
    { month: "Jan", waste: 28 },
    { month: "Feb", waste: 25 },
    { month: "Mar", waste: 22 },
    { month: "Apr", waste: 20 },
    { month: "May", waste: 18 },
    { month: "Jun", waste: 15 },
  ];

  const downloadBusinessReport = () => {
    const reportData = {
      totalRevenue: (totalRevenue / 1000).toFixed(0),
      wasteReduction: totalWasteReduction.toFixed(1),
      predictionAccuracy: averageConfidence.toFixed(0),
      customerSatisfaction: 94,
      productsAnalyzed: products.length,
      reportDate: new Date().toLocaleDateString(),
    };

    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Metric,Value\n" +
      `Total Monthly Revenue,"$${reportData.totalRevenue}K"\n` +
      `Waste Reduction,"${reportData.wasteReduction}%"\n` +
      `Prediction Accuracy,"${reportData.predictionAccuracy}%"\n` +
      `Customer Satisfaction,"${reportData.customerSatisfaction}%"\n` +
      `Products Analyzed,${reportData.productsAnalyzed}\n` +
      `Report Generated,${reportData.reportDate}`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "business_impact_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const shareReport = () => {
    const shareText = `Our AI-powered retail analytics achieved:\n• $${(
      totalRevenue / 1000
    ).toFixed(0)}K monthly revenue\n• ${totalWasteReduction.toFixed(
      1
    )}% waste reduction\n• ${averageConfidence.toFixed(
      0
    )}% prediction accuracy\n• 94% customer satisfaction`;

    if (navigator.share) {
      navigator.share({
        title: "Business Impact Report",
        text: shareText,
      });
    } else {
      navigator.clipboard.writeText(shareText).then(() => {
        showSuccess(
          "Report summary copied to clipboard!",
          "Copied Successfully"
        );
      });
    }
  };

  const scheduleDemo = () => {
    showInfo(
      `Our team will contact you within 24 hours to schedule a personalized demonstration of our AI-powered retail analytics platform.\n\nWhat we'll cover:\n• Live product trend analysis\n• Real-time pricing optimization\n• Marketing channel effectiveness\n• ROI projections for your business\n\nExpected demo duration: 30-45 minutes`,
      "Schedule a Demo"
    );
  };

  const startFreeTrial = () => {
    showInfo(
      `✅ 14-day free trial\n✅ No credit card required\n✅ Full access to all features\n✅ Dedicated support team\n✅ Custom setup assistance\n\nYour trial includes:\n• Complete product trend analysis\n• Pricing optimization tools\n• Marketing insights dashboard\n• Business impact reporting\n\nReady to transform your retail operations?`,
      "Start Your Free Trial"
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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

  const metrics = [
    {
      icon: DollarSign,
      color: "bg-green-500",
      label: "Monthly Revenue",
      value: `$${(totalRevenue / 1000).toFixed(0)}K`,
      change: "+23% from optimization",
      changeIcon: ArrowUp,
      changeColor: "text-green-400",
    },
    {
      icon: Leaf,
      color: "bg-blue-500",
      label: "Waste Reduction",
      value: `${totalWasteReduction.toFixed(1)}%`,
      change: "Environmental impact",
      changeIcon: ArrowDown,
      changeColor: "text-green-400",
    },
    {
      icon: TrendingUp,
      color: "bg-purple-500",
      label: "Prediction Accuracy",
      value: `${averageConfidence.toFixed(0)}%`,
      change: "ML model confidence",
      changeIcon: ArrowUp,
      changeColor: "text-green-400",
    },
    {
      icon: Users,
      color: "bg-orange-500",
      label: "Customer Satisfaction",
      value: "94%",
      change: "Better availability",
      changeIcon: ArrowUp,
      changeColor: "text-green-400",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 to-blue-900 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/10 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [0, -50, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl font-bold mb-4">Empower Your Business</h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            See the real impact of ML-driven insights on your business
            performance. Transform data into actionable strategies that drive
            growth and sustainability.
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="mb-12 flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.button
            onClick={downloadBusinessReport}
            className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-all duration-300 border border-white/20"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download className="h-4 w-4" />
            <span>Download Report</span>
          </motion.button>
          <motion.button
            onClick={shareReport}
            className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-all duration-300 border border-white/20"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Share2 className="h-4 w-4" />
            <span>Share Results</span>
          </motion.button>
          <motion.button
            onClick={() =>
              showInfo(
                `📊 Q2 2025 Performance Summary\n\n• Revenue Growth: +23%\n• Waste Reduction: ${totalWasteReduction.toFixed(
                  1
                )}%\n• Products Optimized: ${
                  products.length
                }\n• Customer Satisfaction: 94%\n• Cost Savings: $47K\n\nFull report available in dashboard.`,
                "Quarterly Report Preview"
              )
            }
            className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-all duration-300 border border-white/20"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Calendar className="h-4 w-4" />
            <span>View Quarterly</span>
          </motion.button>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {metrics.map((metric, index) => {
            const IconComponent = metric.icon;
            const ChangeIcon = metric.changeIcon;

            return (
              <motion.div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group"
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <motion.div
                    className={`w-12 h-12 ${metric.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <IconComponent className="h-6 w-6 text-white" />
                  </motion.div>
                  <div>
                    <div className="text-blue-100">{metric.label}</div>
                    <motion.div
                      className="text-2xl font-bold"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
                    >
                      {metric.value}
                    </motion.div>
                  </div>
                </div>
                <div
                  className={`flex items-center ${metric.changeColor} text-sm`}
                >
                  <ChangeIcon className="h-4 w-4 mr-1" />
                  {metric.change}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Charts */}
        <motion.div
          className="grid lg:grid-cols-2 gap-12 mb-16"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <motion.div
            className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300"
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <h3 className="text-2xl font-bold mb-6">Revenue Growth</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.1)"
                />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.7)" />
                <YAxis stroke="rgba(255,255,255,0.7)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0,0,0,0.8)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "12px",
                    color: "white",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="current"
                  stroke="#6b7280"
                  strokeWidth={3}
                  name="Current Revenue"
                  strokeDasharray="5 5"
                />
                <Line
                  type="monotone"
                  dataKey="optimized"
                  stroke="#10b981"
                  strokeWidth={3}
                  name="Optimized Revenue"
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300"
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <h3 className="text-2xl font-bold mb-6">Waste Reduction Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={wasteData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.1)"
                />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.7)" />
                <YAxis stroke="rgba(255,255,255,0.7)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0,0,0,0.8)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "12px",
                    color: "white",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="waste"
                  stroke="#f59e0b"
                  fill="rgba(245, 158, 11, 0.3)"
                  strokeWidth={3}
                  name="Waste Percentage"
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          whileHover={{ scale: 1.02 }}
        >
          {/* Animated background effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          <div className="relative z-10">
            <motion.h3
              className="text-3xl font-bold mb-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              Ready to Transform Your Business?
            </motion.h3>
            <motion.p
              className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.4 }}
            >
              Join thousands of retailers who are already using ML insights to
              optimize their operations, reduce waste, and increase
              profitability.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.6 }}
            >
              <motion.button
                onClick={startFreeTrial}
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-colors shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <PlayCircle className="h-5 w-5" />
                <span>Start Free Trial</span>
              </motion.button>
              <motion.button
                onClick={scheduleDemo}
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-colors flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Calendar className="h-5 w-5" />
                <span>Schedule Demo</span>
              </motion.button>
            </motion.div>
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

export default BusinessImpact;
