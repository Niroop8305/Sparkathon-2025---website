import React from "react";
import { TrendingUp, BarChart3, Target, ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
      <div className="absolute inset-0 bg-black opacity-10"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Discover the
                <div className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                  Trending
                </div>
              </h1>
              <p className="text-xl text-blue-100 leading-relaxed">
                Harness the power of ML to predict product trends, optimize
                pricing, and maximize sales while minimizing waste. Transform
                your retail strategy with data-driven insights.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="group bg-white text-blue-800 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 flex items-center justify-center">
                View Dashboard
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-800 transition-all duration-300">
                Learn More
              </button>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">92%</div>
                <div className="text-blue-200 text-sm">Prediction Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">31%</div>
                <div className="text-blue-200 text-sm">Waste Reduction</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400">387%</div>
                <div className="text-blue-200 text-sm">Max ROI</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold">Live Trend Analysis</div>
                      <div className="text-blue-200 text-sm">
                        Real-time insights
                      </div>
                    </div>
                  </div>
                  <div className="text-green-400 font-bold">+23%</div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-200">Organic Avocados</span>
                    <span className="text-white font-semibold">Score: 92</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full"
                      style={{ width: "92%" }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-200">Greek Yogurt</span>
                    <span className="text-white font-semibold">Score: 88</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full"
                      style={{ width: "88%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
