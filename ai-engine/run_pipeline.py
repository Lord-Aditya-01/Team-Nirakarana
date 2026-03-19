import pandas as pd
import sys

from preprocessing.preprocess import preprocess
from weather_api.weather_fetch import get_weather_data
from algorithms.risk_prediction import predict_risk
from algorithms.anomaly_detection import detect_anomalies
from algorithms.rule_engine import apply_rules
from algorithms.risk_fusion import compute_final_risk
from algorithms.safety_decision import compute_safety_decision


# -------------------------------
# 🔥 AUTO RENAME DUPLICATE COLUMNS
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
# 🔥 LOAD + MERGE ALL SHEETS
# -------------------------------
def load_and_merge_excel(file_path):

    print("Loading Excel file...")

    all_sheets = pd.read_excel(file_path, sheet_name=None)

    merged_df = pd.DataFrame()

    for sheet_name, df in all_sheets.items():

        print(f"Processing sheet: {sheet_name}")

        if df is None or df.empty:
            continue

        # Normalize column names
        df.columns = (
            df.columns.astype(str)
            .str.strip()
            .str.lower()
            .str.replace(" ", "_")
            .str.replace("/", "_")
        )

        # 🔥 Fix duplicate columns inside sheet
        df.columns = make_columns_unique(df.columns)

        df = df.reset_index(drop=True)

        if merged_df.empty:
            merged_df = df
        else:
            merged_df = pd.concat([merged_df, df], axis=1)

    # 🔥 Fix duplicate columns after merge
    merged_df.columns = make_columns_unique(merged_df.columns)

    print("\nFinal merged columns:\n", merged_df.columns.tolist())

    return merged_df


# -------------------------------
# 🚀 MAIN PIPELINE
# -------------------------------
def main():

    # -------------------------------
    # 🔥 DYNAMIC INPUT FILE
    # -------------------------------
    if len(sys.argv) > 1:
        file_path = sys.argv[1]
    else:
        file_path = "data/Samved_input_Safe1.xlsx"

    print(f"\nUsing input file: {file_path}")

    # -------------------------------
    # 1️⃣ Load & Merge Data
    # -------------------------------
    df = load_and_merge_excel(file_path)

    # -------------------------------
    # 2️⃣ Fetch Weather
    # -------------------------------
    print("\nFetching weather...")
    weather = get_weather_data(file_path)
    print("Weather Data:", weather)

    # -------------------------------
    # 3️⃣ Preprocess
    # -------------------------------
    print("\nPreprocessing...")
    df = preprocess(df, weather)

    # -------------------------------
    # 4️⃣ ML Prediction
    # -------------------------------
    print("\nML Prediction...")
    df = predict_risk(df)

    # -------------------------------
    # 5️⃣ Anomaly Detection
    # -------------------------------
    print("\nDetecting anomalies...")
    df = detect_anomalies(df)

    # -------------------------------
    # 6️⃣ Rule Engine
    # -------------------------------
    print("\nApplying rules...")
    df = apply_rules(df)

    print("\nDEBUG INPUT TO FUSION:\n")
    print(
        df[
            [
                "gas_level_ppm",
                "oxygen_level_percent",
                "ventilation_condition",
                "water_level_condition",
            ]
        ]
    )
    # -------------------------------
    # 7️⃣ Final Fusion
    # -------------------------------
    print("\nFinal fusion...")
    df = compute_final_risk(df)

    df = compute_safety_decision(df)
    # -------------------------------
    # 8️⃣ OUTPUT DISPLAY
    # -------------------------------
    print("\nFINAL OUTPUT:\n")

    output_cols = [
        "ml_prediction",
        "ml_confidence",
        "anomaly_flag",
        "rule_status",
        "final_status",
        "risk_score",
        "risk_reason",
    ]

    print(df[output_cols].to_string(index=False))
    print(
        df[
            [
                "final_status",
                "risk_score",
                "entry_decision",
                "safe_work_time_minutes",
                "decision_reason",
            ]
        ]
    )

    print("\n")
    print("\n")
    print(
        df[
            [
                "safe_work_time_minutes",
            ]
        ]
    )

    print("\n")
    print("\n")
    # -------------------------------
    # 💾 SAVE OUTPUT (OPTIONAL)
    # -------------------------------
    try:
        df.to_excel("output/output_results.xlsx", index=False)
        print("\nResults saved to: output/output_results.xlsx")
    except Exception as e:
        print("\nCould not save file:", e)


# -------------------------------
# ▶️ RUN
# -------------------------------
if __name__ == "__main__":
    main()
