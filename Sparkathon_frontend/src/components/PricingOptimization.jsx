import React from "react";
import { DollarSign, TrendingUp, Zap, Leaf } from "lucide-react";
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

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Optimize Your Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            AI-powered pricing strategies that maximize revenue while reducing
            food waste. Find the perfect balance between profitability and
            sustainability.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
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
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Leaf className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <div className="font-bold text-gray-900">Waste Reduction</div>
                  <div className="text-green-600 font-bold text-2xl">
                    {totalWasteReduction.toFixed(1)}%
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                Average waste reduction across all optimized products
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="font-bold text-gray-900">Sales Boost</div>
                  <div className="text-blue-600 font-bold text-2xl">
                    {(totalSalesIncrease / 1000).toFixed(1)}K
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                Expected additional units sold monthly
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Zap className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <div className="font-bold text-gray-900">ROI Impact</div>
                  <div className="text-purple-600 font-bold text-2xl">
                    +287%
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                Average return on investment improvement
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
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
                    Confidence
                  </th>
                </tr>
              </thead>
              <tbody>
                {visibleProducts.map((product, index) => (
                  <tr
                    key={product.id || product.name || index}
                    className={`border-b border-gray-100 ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    }`}
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
                          typeof product.priceChange === "string" &&
                          product.priceChange.startsWith("+")
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {product.priceChange || "N/A"}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-semibold text-green-600">
                      {product.wasteReduction}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${product.confidence}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">
                          {product.confidence}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {products.length > visibleCount && (
              <div className="flex justify-center mt-6">
                <button
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  onClick={() => setVisibleCount((prev) => prev + 6)}
                >
                  Show More
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingOptimization;
