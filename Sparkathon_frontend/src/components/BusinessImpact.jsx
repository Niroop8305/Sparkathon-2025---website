import React from "react";
import {
  TrendingUp,
  DollarSign,
  Leaf,
  Users,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
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

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 to-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Empower Your Business</h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            See the real impact of ML-driven insights on your business
            performance. Transform data into actionable strategies that drive
            growth and sustainability.
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-blue-100">Monthly Revenue</div>
                <div className="text-2xl font-bold">
                  ${(totalRevenue / 1000).toFixed(0)}K
                </div>
              </div>
            </div>
            <div className="flex items-center text-green-400 text-sm">
              <ArrowUp className="h-4 w-4 mr-1" />
              +23% from optimization
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-blue-100">Waste Reduction</div>
                <div className="text-2xl font-bold">
                  {totalWasteReduction.toFixed(1)}%
                </div>
              </div>
            </div>
            <div className="flex items-center text-green-400 text-sm">
              <ArrowDown className="h-4 w-4 mr-1" />
              Environmental impact
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-blue-100">Prediction Accuracy</div>
                <div className="text-2xl font-bold">
                  {averageConfidence.toFixed(0)}%
                </div>
              </div>
            </div>
            <div className="flex items-center text-green-400 text-sm">
              <ArrowUp className="h-4 w-4 mr-1" />
              ML model confidence
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-blue-100">Customer Satisfaction</div>
                <div className="text-2xl font-bold">94%</div>
              </div>
            </div>
            <div className="flex items-center text-green-400 text-sm">
              <ArrowUp className="h-4 w-4 mr-1" />
              Better availability
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
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
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
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
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12">
          <h3 className="text-3xl font-bold mb-4">
            Ready to Transform Your Business?
          </h3>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of retailers who are already using ML insights to
            optimize their operations, reduce waste, and increase profitability.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-colors">
              Start Free Trial
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              Schedule Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessImpact;
