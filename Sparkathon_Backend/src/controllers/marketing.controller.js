// src/controllers/marketing.controller.js

const sampleMarketingData = [
  {
    product: "Organic Avocados",
    channels: [
      { name: "Social Media", effectiveness: 87, cost: "$2,340", roi: "312%" },
      { name: "Email Marketing", effectiveness: 72, cost: "$890", roi: "245%" },
      {
        name: "In-Store Display",
        effectiveness: 91,
        cost: "$1,200",
        roi: "387%",
      },
      { name: "Digital Ads", effectiveness: 68, cost: "$3,450", roi: "198%" },
    ],
    optimalMessage: "Fresh, healthy, and sustainably sourced",
  },
  {
    product: "Greek Yogurt",
    channels: [
      { name: "Social Media", effectiveness: 78, cost: "$1,890", roi: "267%" },
      { name: "Email Marketing", effectiveness: 84, cost: "$650", roi: "289%" },
      {
        name: "In-Store Display",
        effectiveness: 76,
        cost: "$980",
        roi: "234%",
      },
      { name: "Digital Ads", effectiveness: 82, cost: "$2,100", roi: "278%" },
    ],
    optimalMessage: "High protein, low sugar, perfect for active lifestyles",
  },
];

export const getMarketing = (req, res) => {
  res.json({
    success: true,
    data: sampleMarketingData,
    timestamp: new Date().toISOString(),
  });
};
