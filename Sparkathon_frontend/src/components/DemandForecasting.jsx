import React from "react";
import { API_BASE_URL } from "../config/api";
import { BrainCircuit, Loader2, Sparkles, AlertTriangle } from "lucide-react";

const friendlyFeatureNames = {
  holiday_flag: "Holiday Effect",
  sales_lag_1: "Yesterday's Sales",
  sales_lag_3: "Sales 3 Days Ago",
  sales_lag_7: "Sales 7 Days Ago",
  sales_rolling_mean_7: "Recent 7-Day Demand",
  sales_rolling_std_7: "Recent Demand Variation",
  discount: "Discount Level",
  avg_temperature: "Temperature",
  avg_humidity: "Humidity",
  precpt: "Precipitation",
  avg_wind_level: "Wind Level",
  day_of_week: "Day of the Week",
  is_weekend: "Weekend Effect",
  stockout_lag_1: "Yesterday's Stockout",
  stockout_lag_3: "Stockout 3 Days Ago",
  stockout_lag_7: "Stockout 7 Days Ago",
  stock_hours_lag_1: "Stock Unavailability Yesterday",
  stock_hours_lag_3: "Stock Unavailability 3 Days Ago",
  stock_hours_lag_7: "Stock Unavailability 7 Days Ago",
  stockout_intensity_lag_7: "Recent Stockout Intensity",
  product_id: "Product",
  store_id: "Store",
  activity_flag: "Promotional Activity",
  temp_humidity_interaction: "Temperature + Humidity",
  rain_temp_interaction: "Rainfall + Temperature",
  city_id: "City",
  management_group_id: "Management Group",
  first_category_id: "Product Category",
  second_category_id: "Product Subcategory",
  third_category_id: "Product Type",
  year: "Year",
  month: "Month",
  day: "Day of the Month",
  week_of_year: "Week of the Year",
  day_of_year: "Day of the Year",
  day_of_week_sin: "Weekly Seasonality",
  day_of_week_cos: "Weekly Seasonality",
  month_sin: "Monthly Seasonality",
  month_cos: "Monthly Seasonality",
};

function getHumanReadableExplanation(feature, value, shapValue) {
  const numericValue = Number(value);
  const safeValue = Number.isFinite(numericValue) ? numericValue : null;

  const explanations = {
    holiday_flag:
      safeValue === 1
        ? "A holiday condition is supporting higher expected demand."
        : "There is no holiday-related demand boost for this date.",

    sales_lag_1:
      safeValue !== null
        ? `Sales on the previous day were ${safeValue.toFixed(2)} units.`
        : "Previous-day sales were considered by the model.",

    sales_lag_3:
      safeValue !== null
        ? `Sales three days earlier were ${safeValue.toFixed(2)} units.`
        : "Sales from three days earlier were considered.",

    sales_lag_7:
      safeValue !== null
        ? `Sales seven days earlier were ${safeValue.toFixed(2)} units.`
        : "Sales from seven days earlier were considered.",

    sales_rolling_mean_7:
      safeValue !== null
        ? `Average sales over the previous 7 days were ${safeValue.toFixed(2)} units.`
        : "Recent 7-day average demand was considered.",

    sales_rolling_std_7:
      safeValue !== null
        ? `Recent demand variation was ${safeValue.toFixed(2)} units.`
        : "Recent demand variation was considered.",

    discount:
      safeValue !== null
        ? `The discount factor for this product is ${(safeValue * 100).toFixed(1)}%.`
        : "The product's discount level was considered.",

    avg_temperature:
      safeValue !== null
        ? `The average temperature was ${safeValue.toFixed(1)}°C.`
        : "Temperature conditions were considered.",

    avg_humidity:
      safeValue !== null
        ? `Average humidity was ${safeValue.toFixed(1)}%.`
        : "Humidity conditions were considered.",

    precpt:
      safeValue !== null
        ? `Recorded precipitation was ${safeValue.toFixed(2)}.`
        : "Precipitation conditions were considered.",

    avg_wind_level:
      safeValue !== null
        ? `The average wind level was ${safeValue.toFixed(2)}.`
        : "Wind conditions were considered.",
    
    day:
  safeValue !== null
    ? `The prediction is for day ${safeValue.toFixed(0)} of the month.`
    : "The day of the month was considered.",
    
    day_of_week:
  safeValue !== null
    ? `The prediction is for ${
        [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ][Math.round(safeValue)] || "an unspecified day"
      }.`
    : "The day of the week was considered.",

    is_weekend:
      safeValue === 1
        ? "The selected date is a weekend."
        : "The selected date is a weekday.",

    stockout_lag_1:
      safeValue === 1
        ? "The product experienced a stockout on the previous day."
        : "No stockout was recorded on the previous day.",

    stockout_lag_3:
      safeValue === 1
        ? "A stockout occurred three days earlier."
        : "No stockout was recorded three days earlier.",

    stockout_lag_7:
      safeValue === 1
        ? "A stockout occurred seven days earlier."
        : "No stockout was recorded seven days earlier.",

    stock_hours_lag_1:
      safeValue !== null
        ? `The product was unavailable for approximately ${safeValue.toFixed(0)} hours on the previous day.`
        : "Recent product availability was considered.",

    stock_hours_lag_3:
      safeValue !== null
        ? `The product was unavailable for approximately ${safeValue.toFixed(0)} hours three days earlier.`
        : "Recent product availability was considered.",

    stock_hours_lag_7:
      safeValue !== null
        ? `The product was unavailable for approximately ${safeValue.toFixed(0)} hours seven days earlier.`
        : "Recent product availability was considered.",

    stockout_intensity_lag_7:
      safeValue !== null
        ? `The recent stockout intensity was ${(safeValue * 100).toFixed(0)}%.`
        : "Recent stockout intensity was considered.",

    product_id:
      safeValue !== null
        ? `This prediction is for product ${safeValue.toFixed(0)}.`
        : "The product identity was considered.",

    store_id:
      safeValue !== null
        ? `This prediction is for store ${safeValue.toFixed(0)}.`
        : "The store identity was considered.",

    activity_flag:
      safeValue === 1
        ? "An active promotion or activity was present."
        : "No promotional activity was recorded.",

    temp_humidity_interaction:
      "The combined temperature and humidity conditions were considered.",

    rain_temp_interaction:
      "The combined precipitation and temperature conditions were considered.",
  };

  return (
    explanations[feature] ||
    `${feature.replaceAll("_", " ")} influenced the prediction.`
  );
}

function generateOverallExplanation(topFeatures, prediction) {
  if (!topFeatures || topFeatures.length === 0) {
    return "The prediction is based on recent demand, product, availability, weather and calendar conditions.";
  }

  const positiveFeatures = topFeatures.filter(
    (item) => Number(item.shap_value) >= 0
  );

  const negativeFeatures = topFeatures.filter(
    (item) => Number(item.shap_value) < 0
  );

  const strongestNegative = negativeFeatures[0];
  const strongestPositive = positiveFeatures[0];

  const negativeName = strongestNegative
    ? friendlyFeatureNames[strongestNegative.feature] ||
      strongestNegative.feature.replaceAll("_", " ")
    : null;

  const positiveName = strongestPositive
    ? friendlyFeatureNames[strongestPositive.feature] ||
      strongestPositive.feature.replaceAll("_", " ")
    : null;

  let explanation = `Demand is predicted to be ${Number(prediction).toFixed(
    2
  )} units. `;

  if (negativeName) {
    explanation += `The strongest factors lowering the prediction include ${negativeName}`;
  }

  if (positiveName) {
    explanation += `, while ${positiveName} provides some upward support.`;
  } else {
    explanation += ".";
  }

  return explanation;
}

function getImpactPercentage(shapValue, allShapValues) {
  const sameDirectionValues = allShapValues.filter(
    (value) =>
      (shapValue >= 0 && value >= 0) ||
      (shapValue < 0 && value < 0)
  );

  const totalImpact = sameDirectionValues.reduce(
    (sum, value) => sum + Math.abs(value),
    0
  );

  if (totalImpact === 0) {
    return 0;
  }

  return (Math.abs(shapValue) / totalImpact) * 100;
}

function DemandForecasting() {
  const [samples, setSamples] = React.useState([]);
  const [selectedSample, setSelectedSample] = React.useState(null);
  const [loadingSamples, setLoadingSamples] = React.useState(true);
  const [prediction, setPrediction] = React.useState(null);
  const [explanation, setExplanation] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
    React.useEffect(() => {
    const loadSamples = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/forecast/samples`);

        if (!response.ok) {
          throw new Error("Unable to load inference samples");
        }

        const data = await response.json();

        setSamples(data.data || []);

        if (data.data && data.data.length > 0) {
          setSelectedSample(data.data[0]);
        }
      } catch (err) {
        setError(err.message || "Unable to load inference samples");
      } finally {
        setLoadingSamples(false);
      }
    };

    loadSamples();
  }, []);

    const runForecast = async () => {
    if (!selectedSample) {
      setError("Please select an inference sample first.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Remove the date before sending features to the ML service
      const { dt, ...features } = selectedSample;

      // Convert CSV string values into numbers
      const numericFeatures = Object.fromEntries(
        Object.entries(features).map(([key, value]) => [
          key,
          Number(value),
        ])
      );

      const [predictionResponse, explanationResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/forecast/predict`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            features: numericFeatures,
          }),
        }),

        fetch(`${API_BASE_URL}/forecast/explain`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            features: numericFeatures,
          }),
        }),
      ]);

      if (!predictionResponse.ok || !explanationResponse.ok) {
        throw new Error("Forecasting service returned an error");
      }

      const predictionData = await predictionResponse.json();
      const explanationData = await explanationResponse.json();

      setPrediction(predictionData.data.predicted_demand);
      setExplanation(explanationData.data);
    } catch (err) {
      setError(err.message || "Unable to generate forecast");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <div className="bg-white rounded-3xl shadow-xl p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-blue-100 rounded-2xl">
            <BrainCircuit className="h-8 w-8 text-blue-600" />
          </div>

          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Stockout-Aware Demand Forecasting
            </h2>

            <p className="text-gray-500 mt-1">
              Explainable AI powered demand prediction using LightGBM
            </p>
          </div>
        </div>

        <div className="mb-4">
  <label className="block text-sm font-medium mb-2">
    Select Inference Sample
  </label>

  <select
    className="w-full border rounded-lg p-3"
    value={
      selectedSample
        ? samples.findIndex(
            (sample) =>
              sample.dt === selectedSample.dt &&
              sample.store_id === selectedSample.store_id &&
              sample.product_id === selectedSample.product_id
          )
        : ""
    }
    onChange={(e) => {
      const index = Number(e.target.value);
      setSelectedSample(samples[index]);
      setPrediction(null);
      setExplanation(null);
      setError(null);
    }}
    disabled={loadingSamples || samples.length === 0}
  >
    {loadingSamples ? (
      <option>Loading inference samples...</option>
    ) : (
      samples.map((sample, index) => (
        <option key={index} value={index}>
          {sample.dt} | Store {sample.store_id} | Product {sample.product_id}
        </option>
      ))
    )}
  </select>
</div>

        {/* Forecast button */}
        <button
          onClick={runForecast}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-60 transition"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Generating Forecast...
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              Generate Demand Forecast
            </>
          )}
        </button>

        {/* Error */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-xl flex gap-3">
            <AlertTriangle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}

        {/* Results */}
        {prediction !== null && (
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            {/* Prediction */}
            <div className="bg-blue-50 rounded-2xl p-6">
              <p className="text-sm font-medium text-gray-500">
                Predicted Demand
              </p>

              <p className="text-5xl font-bold text-blue-600 mt-2">
                {prediction.toFixed(2)}
              </p>

              <p className="text-gray-500 mt-2">
                Expected sales for the selected conditions
              </p>
            </div>

            {/* Model */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <p className="text-sm font-medium text-gray-500">
                Forecasting Model
              </p>

              <p className="text-2xl font-bold text-gray-900 mt-2">
                Stockout-Aware LightGBM
              </p>

              <p className="text-gray-500 mt-2">
                Uses historical demand, availability, weather, calendar and
                product information.
              </p>
            </div>
          </div>
        )}

        {/* SHAP explanation */}
        {explanation && explanation.top_features && (
          <div className="mt-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Why did the model make this prediction?
            </h3>

            <div className="bg-gray-50 rounded-2xl p-6">
              <p className="text-sm text-gray-500 mb-4">
                Top factors identified by SHAP
              </p>

              <div className="space-y-3">
                {explanation?.top_features?.length > 0 && (
  <div className="mt-6">
    <h3 className="text-lg font-semibold mb-4">
      Why was this demand predicted?
    </h3>

    <p className="text-sm text-gray-500 mb-5">
      The model uses recent sales, promotions, availability and other
      conditions to estimate demand. The percentages below show the
      relative contribution of each displayed factor.
    </p>
    <div className="mb-6 rounded-lg border p-4">
  <h4 className="font-semibold mb-2">
    💡 Overall Explanation
  </h4>

  <p className="text-sm text-gray-700 leading-relaxed">
    {generateOverallExplanation(
      explanation.top_features,
      prediction
    )}
  </p>
</div>

    {(() => {
      const positiveFeatures = explanation.top_features.filter(
        (item) => Number(item.shap_value) >= 0
      );

      const negativeFeatures = explanation.top_features.filter(
        (item) => Number(item.shap_value) < 0
      );

      const allShapValues = explanation.top_features.map((item) =>
        Number(item.shap_value)
      );

      return (
        <div className="space-y-6">

          {/* Factors lowering demand */}
          {negativeFeatures.length > 0 && (
            <div>
              <h4 className="font-semibold text-red-600 mb-3">
                🔴 Factors lowering predicted demand
              </h4>

              <div className="space-y-3">
                {negativeFeatures.map((item, index) => {
                  const shapValue = Number(item.shap_value);

                  const impactPercentage = getImpactPercentage(
                    shapValue,
                    allShapValues
                  );

                  const explanationText = getHumanReadableExplanation(
                    item.feature,
                    Number(item.value ?? item.feature_value ?? item.input_value),
                    shapValue
                  );

                  return (
                    <div
                      key={`negative-${index}`}
                      className="border rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <p className="font-medium">
  {friendlyFeatureNames[item.feature] || item.feature.replaceAll("_", " ")}
</p>

                          <p className="text-sm text-gray-600 mt-1">
                            {explanationText}
                          </p>
                        </div>

                        <span className="font-semibold text-red-600 whitespace-nowrap">
                          {impactPercentage.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Factors increasing demand */}
          {positiveFeatures.length > 0 && (
            <div>
              <h4 className="font-semibold text-green-600 mb-3">
                🟢 Factors supporting predicted demand
              </h4>

              <div className="space-y-3">
                {positiveFeatures.map((item, index) => {
                  const shapValue = Number(item.shap_value);

                  const impactPercentage = getImpactPercentage(
                    shapValue,
                    allShapValues
                  );

                  const explanationText = getHumanReadableExplanation(
                    item.feature,
                    Number(item.value ?? item.feature_value ?? item.input_value),
                    shapValue
                  );

                  return (
                    <div
                      key={`positive-${index}`}
                      className="border rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <p className="font-medium">
  {friendlyFeatureNames[item.feature] || item.feature.replaceAll("_", " ")}
</p>

                          <p className="text-sm text-gray-600 mt-1">
                            {explanationText}
                          </p>
                        </div>

                        <span className="font-semibold text-green-600 whitespace-nowrap">
                          {impactPercentage.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      );
    })()}
  </div>
)}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default DemandForecasting;