import pandas as pd
import sys
import json

from preprocessing.preprocess import preprocess
from weather_api.weather_fetch import get_weather_data
from algorithms.risk_prediction import predict_risk
from algorithms.anomaly_detection import detect_anomalies
from algorithms.rule_engine import apply_rules
from algorithms.risk_fusion import compute_final_risk
from algorithms.safety_decision import compute_safety_decision


# -------------------------------
# 🔥 SAFE LOGGER (stderr ONLY)
# -------------------------------
def log(msg):
    try:
        print(str(msg), file=sys.stderr)
    except:
        pass


# -------------------------------
# 🔥 MAKE COLUMNS UNIQUE
# -------------------------------
def make_columns_unique(columns):
    seen = {}
    new_cols = []

    for col in columns:
        if col not in seen:
            seen[col] = 0
            new_cols.append(col)
        else:
            seen[col] += 1
            new_cols.append(f"{col}_{seen[col]}")

    return new_cols


# -------------------------------
# 🔥 LOAD + MERGE EXCEL
# -------------------------------
def load_and_merge_excel(file_path):

    log("Loading Excel file...")

    all_sheets = pd.read_excel(file_path, sheet_name=None)
    merged_df = pd.DataFrame()

    for sheet_name, df in all_sheets.items():

        log(f"Processing sheet: {sheet_name}")

        if df is None or df.empty:
            continue

        # Normalize columns
        df.columns = (
            df.columns.astype(str)
            .str.strip()
            .str.lower()
            .str.replace(" ", "_")
            .str.replace("/", "_")
        )

        df.columns = make_columns_unique(df.columns)
        df = df.reset_index(drop=True)

        if merged_df.empty:
            merged_df = df
        else:
            merged_df = pd.concat([merged_df, df], axis=1)

    merged_df.columns = make_columns_unique(merged_df.columns)

    log(f"Final columns count: {len(merged_df.columns)}")

    return merged_df


# -------------------------------
# 🚀 MAIN PIPELINE
# -------------------------------
def main():

    results = []  # ✅ FIX: always defined

    try:
        # -------------------------------
        # 📥 INPUT FILE
        # -------------------------------
        if len(sys.argv) > 1:
            file_path = sys.argv[1]
        else:
            raise Exception("No input file provided")

        log(f"Using file: {file_path}")

        # -------------------------------
        # 1️⃣ LOAD
        # -------------------------------
        df = load_and_merge_excel(file_path)

        # -------------------------------
        # 2️⃣ WEATHER
        # -------------------------------
        log("Fetching weather...")
        weather = get_weather_data(file_path)

        # -------------------------------
        # 3️⃣ PREPROCESS
        # -------------------------------
        log("Preprocessing...")
        df = preprocess(df, weather)

        # -------------------------------
        # 4️⃣ ML PREDICTION
        # -------------------------------
        log("Running ML prediction...")
        df = predict_risk(df)

        # -------------------------------
        # 5️⃣ ANOMALY DETECTION
        # -------------------------------
        log("Detecting anomalies...")
        df = detect_anomalies(df)

        # -------------------------------
        # 6️⃣ RULE ENGINE
        # -------------------------------
        log("Applying rules...")
        df = apply_rules(df)

        # -------------------------------
        # 7️⃣ FINAL RISK
        # -------------------------------
        log("Computing final risk...")
        df = compute_final_risk(df)

        # -------------------------------
        # 8️⃣ SAFETY DECISION
        # -------------------------------
        log("Computing safety decision...")
        df = compute_safety_decision(df)

        # -------------------------------
        # ✅ FINAL JSON OUTPUT
        # -------------------------------
        for _, row in df.iterrows():
            try:
                reasons = []

                if row.get("oxygen_level_percent", 21) < 19:
                    reasons.append("Low Oxygen Level")

                if row.get("gas_level_ppm", 0) > 50:
                    reasons.append("High Toxic Gas")

                if str(row.get("ventilation_condition", "")).lower() in ["poor", "bad"]:
                    reasons.append("Poor Ventilation")

                if str(row.get("water_level_condition", "")).lower() in ["high"]:
                    reasons.append("High Water Level Risk")

                if not reasons:
                    reasons.append("Normal Conditions")

                results.append(
                    {
                        "final_status": str(row.get("final_status", "UNKNOWN")),
                        "risk_score": int(row.get("risk_score", 0)),
                        "entry_decision": str(row.get("entry_decision", "DENY")),
                        "safe_work_time_minutes": int(
                            row.get("safe_work_time_minutes", 0)
                        ),
                        "risk_reason": ", ".join(reasons),
                        "decision_reason": str(row.get("decision_reason", "")),
                    }
                )

            except Exception as row_error:
                log(f"Row error: {row_error}")

        # ✅ ONLY THIS PRINT GOES TO NODE
        print(json.dumps(results))

    except Exception as e:
        # ✅ ALWAYS RETURN JSON
        print(json.dumps({"error": str(e), "results": results}))


# -------------------------------
# ▶️ RUN
# -------------------------------
if __name__ == "__main__":
    main()
