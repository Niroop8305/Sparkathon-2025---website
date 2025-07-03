import React from "react";
import {
  MessageSquare,
  Mail,
  Monitor,
  Smartphone,
  Target,
  TrendingUp,
} from "lucide-react";
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

  const allChannelsData = marketingData.flatMap((product) =>
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

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Revolutionize Your Marketing
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover which marketing channels and messages drive the best
            results for each product. Optimize your marketing spend with
            data-driven insights.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-8">
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
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-green-100">Best Performing Channel</div>
                  <div className="text-2xl font-bold">In-Store Display</div>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Monitor className="h-6 w-6" />
                </div>
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-gray-600 text-sm">Total Channels</div>
                <div className="text-2xl font-bold text-gray-900">4</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-gray-600 text-sm">Avg. ROI</div>
                <div className="text-2xl font-bold text-green-600">278%</div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {marketingData.map((product, productIndex) => (
            <div key={productIndex} className="bg-gray-50 rounded-3xl p-8">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {product.product}
                </h3>
                <div className="bg-blue-100 rounded-xl p-4 inline-block">
                  <div className="text-blue-800 text-sm font-medium">
                    Optimal Message
                  </div>
                  <div className="text-blue-900 font-semibold">
                    "{product.optimalMessage}"
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {product.channels.map((channel, channelIndex) => (
                  <div
                    key={channelIndex}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                        {getChannelIcon(channel.name)}
                      </div>
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
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${getEffectivenessColor(
                              channel.effectiveness
                            )}`}
                            style={{ width: `${channel.effectiveness}%` }}
                          ></div>
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
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MarketingInsights;
