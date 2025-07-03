import React from "react";
import { TrendingUp, Package, Target, BarChart3 } from "lucide-react";

const ProductTrends = ({ products }) => {
  const getDemandColor = (demand) => {
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

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Predict Product Trends
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our ML algorithms analyze market data, seasonal patterns, and
            consumer behavior to predict which perishable products will trend in
            the coming weeks.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 border border-blue-200">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6">
              <BarChart3 className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Advanced Analytics
            </h3>
            <p className="text-gray-600">
              Machine learning models process thousands of data points to
              identify emerging trends before they become mainstream.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 border border-green-200">
            <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mb-6">
              <Target className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Demand Prediction
            </h3>
            <p className="text-gray-600">
              Accurate forecasting helps you stock the right products at the
              right time, reducing waste and maximizing profits.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 border border-purple-200 md:col-span-2 lg:col-span-1">
            <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mb-6">
              <Package className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Category Intelligence
            </h3>
            <p className="text-gray-600">
              Get insights across all product categories from produce to
              prepared foods, dairy to seafood.
            </p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-3xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Current Trending Products
          </h3>

          <div className="grid lg:grid-cols-2 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">
                      {product.name}
                    </h4>
                    <p className="text-gray-600">{product.category}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getDemandColor(
                      product.predictedDemand
                    )}`}
                  >
                    {product.predictedDemand}
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
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full bg-gradient-to-r ${getScoreColor(
                          product.trendScore
                        )}`}
                        style={{ width: `${product.trendScore}%` }}
                      ></div>
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
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductTrends;
