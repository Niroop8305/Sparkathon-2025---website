import React from "react";
import Hero from "../components/Hero";
import ProductTrends from "../components/ProductTrends";
import PricingOptimization from "../components/PricingOptimization";
import MarketingInsights from "../components/MarketingInsights";
import BusinessImpact from "../components/BusinessImpact";
import NavBar from "../components/NavBar";
import { API_BASE_URL } from "../config/api";

function Dashboard() {
  const [products, setProducts] = React.useState([]);
  const [prices, setPrices] = React.useState([]);
  const [marketingData, setMarketingData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [selected, setSelected] = React.useState("productTrends");
  // Get userId from token (assuming JWT in localStorage)
  let userId = null;
  try {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      userId = payload.id;
    }
  } catch {}

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, priceRes, marketingRes] = await Promise.all([
          fetch(`${API_BASE_URL}/products`),
          fetch(`${API_BASE_URL}/products/pricing`),
          fetch(`${API_BASE_URL}/marketing`),
        ]);

        if (!productsRes.ok || !marketingRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const productsData = await productsRes.json();
        const priceData = await priceRes.json();
        const marketingDataRes = await marketingRes.json();

        setProducts(productsData.data);
        setPrices(priceData.data);
        setMarketingData(marketingDataRes.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading ML insights...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            {/* You can use any icon here */}
          </div>
          <p className="text-gray-600">Error loading data: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white relative">
      <Hero />
      <div className="w-full" data-section="dashboard">
        <div className="mb-0">
          <NavBar selected={selected} onSelect={setSelected} />
        </div>
        <div className="mt-0">
          {selected === "productTrends" && (
            <ProductTrends products={products} />
          )}
          {selected === "pricingOptimization" && (
            <PricingOptimization products={prices} />
          )}
          {selected === "marketingInsights" && (
            <MarketingInsights marketingData={marketingData} />
          )}
        </div>
      </div>
      <div data-section="about">
        <BusinessImpact products={products} />
      </div>
    </div>
  );
}

export default Dashboard;
