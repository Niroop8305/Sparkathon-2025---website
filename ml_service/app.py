from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import lightgbm as lgb
import shap
import pandas as pd
import numpy as np
import json
import os


# --------------------------------------------------
# Initialize FastAPI
# --------------------------------------------------

app = FastAPI(
    title="Stockout-Aware Demand Forecasting API",
    description="Demand forecasting and explainability API",
    version="1.0"
)


# --------------------------------------------------
# Load model and feature configuration
# --------------------------------------------------

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(
    BASE_DIR,
    "stockout_aware_lightgbm.txt"
)

CONFIG_PATH = os.path.join(
    BASE_DIR,
    "feature_config.json"
)


model = lgb.Booster(
    model_file=MODEL_PATH
)

with open(CONFIG_PATH, "r") as f:
    feature_config = json.load(f)

FEATURES = feature_config["features"]

explainer = shap.TreeExplainer(model)


# --------------------------------------------------
# API input schema
# --------------------------------------------------

class PredictionRequest(BaseModel):
    features: dict[str, float]


# --------------------------------------------------
# Root endpoint
# --------------------------------------------------

@app.get("/")
def root():
    return {
        "message": "Stockout-Aware Demand Forecasting API",
        "status": "running",
        "model": "Stockout-Aware LightGBM",
        "features": len(FEATURES)
    }


# --------------------------------------------------
# Prediction endpoint
# --------------------------------------------------

@app.post("/predict")
def predict(request: PredictionRequest):

    try:
        missing_features = [
            feature
            for feature in FEATURES
            if feature not in request.features
        ]

        if missing_features:
            raise HTTPException(
                status_code=400,
                detail={
                    "error": "Missing required features",
                    "missing_features": missing_features
                }
            )

        input_data = pd.DataFrame(
            [[request.features[feature] for feature in FEATURES]],
            columns=FEATURES
        )

        prediction = model.predict(input_data)[0]

        # Demand cannot be negative
        prediction = max(float(prediction), 0.0)

        return {
            "predicted_demand": prediction
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# --------------------------------------------------
# SHAP explanation endpoint
# --------------------------------------------------

@app.post("/explain")
def explain(request: PredictionRequest):

    try:
        missing_features = [
            feature
            for feature in FEATURES
            if feature not in request.features
        ]

        if missing_features:
            raise HTTPException(
                status_code=400,
                detail={
                    "error": "Missing required features",
                    "missing_features": missing_features
                }
            )

        input_data = pd.DataFrame(
            [[request.features[feature] for feature in FEATURES]],
            columns=FEATURES
        )

        prediction = model.predict(input_data)[0]

        prediction = max(float(prediction), 0.0)

        shap_values = explainer.shap_values(input_data)

        shap_row = np.asarray(shap_values)[0]

        base_value = explainer.expected_value

        if isinstance(base_value, np.ndarray):
            base_value = base_value.item()

        explanation = pd.DataFrame({
            "feature": FEATURES,
            "feature_value": input_data.iloc[0].values,
            "shap_value": shap_row
        })

        explanation["absolute_shap"] = (
            explanation["shap_value"].abs()
        )

        explanation = explanation.sort_values(
            "absolute_shap",
            ascending=False
        )

        top_features = []

        for _, row in explanation.head(10).iterrows():

            top_features.append({
                "feature": row["feature"],
                "feature_value": float(row["feature_value"]),
                "shap_value": float(row["shap_value"]),
                "absolute_shap": float(row["absolute_shap"])
            })

        return {
            "predicted_demand": prediction,
            "base_value": float(base_value),
            "top_features": top_features
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )