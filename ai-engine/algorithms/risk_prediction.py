import pandas as pd
import joblib
import os


import os
import joblib
import pandas as pd

# ✅ correct base path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# ✅ correct model paths
model_path = os.path.join(BASE_DIR, "../models/risk_model.pkl")
features_path = os.path.join(BASE_DIR, "../models/model_features.pkl")

# ✅ load models
model = joblib.load(model_path)
model_features = joblib.load(features_path)


# -------------------------------
# 🔥 SAFE COLUMN ACCESS
# -------------------------------
def get_series(df, col):
    if col not in df.columns:
        return pd.Series([0] * len(df))

    data = df[col]

    # If duplicate columns → take first
    if isinstance(data, pd.DataFrame):
        data = data.iloc[:, 0]

    return data.reset_index(drop=True)


def predict_risk(df):

    print("🤖 Running ML prediction...")

    # -------------------------------
    # 🚨 REMOVE DUPLICATE COLUMNS
    # -------------------------------
    df = df.loc[:, ~df.columns.duplicated()].copy()

    # -------------------------------
    # ✅ PREPARE FEATURES
    # -------------------------------
    features = df.copy()

    for col in model_features:
        if col not in features:
            features[col] = 0

    features = features[model_features]

    # -------------------------------
    # ✅ PREDICT
    # -------------------------------
    probs = model.predict_proba(features)
    preds = probs.argmax(axis=1)
    confidence = probs.max(axis=1)

    df["ml_prediction"] = preds
    df["ml_confidence"] = confidence

    # -------------------------------
    # 🔥 SAFE SERIES (NO CRASH)
    # -------------------------------
    gas = get_series(df, "gas_level_ppm")
    oxygen = get_series(df, "oxygen_level_percent")
    water = get_series(df, "water_level_condition")
    ventilation = get_series(df, "ventilation_condition")

    # -------------------------------
    # 🔥 UNCERTAINTY
    # -------------------------------
    df["uncertain"] = df["ml_confidence"] < 0.65

    # SAFE → ALERT if unsure
    df.loc[
        (df["ml_prediction"] == 0) & (df["ml_confidence"] < 0.6), "ml_prediction"
    ] = 1

    # -------------------------------
    # 🔥 MODERATE RISK FIX
    # -------------------------------
    df.loc[(gas > 40) | (water == 2) | (ventilation >= 2), "ml_prediction"] = df[
        "ml_prediction"
    ].clip(lower=1)

    # -------------------------------
    # 🔥 HIGH RISK → DANGER
    # -------------------------------
    df.loc[(gas > 80) | (oxygen < 18), "ml_prediction"] = 2

    print("✅ Prediction completed")

    return df
