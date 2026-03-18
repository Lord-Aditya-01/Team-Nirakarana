import pandas as pd


# -------------------------------
# 🔥 MAKE COLUMN NAMES UNIQUE
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
# 🔥 SAFE COLUMN ACCESS
# -------------------------------
def get_series(df, col):
    if col not in df.columns:
        return pd.Series([0] * len(df))

    data = df[col]

    # If duplicate → DataFrame → take first column
    if isinstance(data, pd.DataFrame):
        data = data.iloc[:, 0]

    return data.reset_index(drop=True)


# -------------------------------
# 🚀 MAIN PREPROCESS FUNCTION
# -------------------------------
def preprocess(df, weather):

    print("🧹 Starting preprocessing...")

    # -------------------------------
    # ✅ NORMALIZE COLUMN NAMES
    # -------------------------------
    df.columns = (
        df.columns.astype(str)
        .str.strip()
        .str.lower()
        .str.replace(" ", "_")
        .str.replace("/", "_")
    )

    # -------------------------------
    # 🚨 REMOVE DUPLICATES (CRITICAL)
    # -------------------------------
    df = df.loc[:, ~df.columns.duplicated()]

    # Extra safety
    df.columns = make_columns_unique(df.columns)

    # -------------------------------
    # 🚨 FIX INDEX
    # -------------------------------
    df = df.reset_index(drop=True)

    # -------------------------------
    # ✅ CLEAN STRING VALUES
    # -------------------------------
    df = df.apply(
        lambda col: col.map(lambda x: x.strip().lower() if isinstance(x, str) else x)
    )

    # -------------------------------
    # ✅ FIX COLUMN NAME MISMATCH
    # -------------------------------
    df.rename(
        columns={
            "water_level_status": "water_level_condition",
            "sensor_temperature_c": "temperature_c",
        },
        inplace=True,
    )

    # -------------------------------
    # ✅ ADD WEATHER DATA
    # -------------------------------
    if weather:
        df["temperature_c"] = weather.get("temperature_c", 30)
        df["humidity_percent"] = weather.get("humidity_percent", 50)
        df["rainfall_last_24h_mm"] = weather.get("rainfall_last_24h_mm", 0)

    # -------------------------------
    # ✅ DEFAULT VALUES
    # -------------------------------
    defaults = {
        "gas_level_ppm": 0,
        "oxygen_level_percent": 20.9,
        "water_level_condition": "normal",
        "temperature_c": 30,
        "humidity_percent": 50,
        "number_of_workers": 1,
        "expected_work_duration_minutes": 30,
        "sewer_depth_m": 1,
        "ventilation_condition": "good",
        "past_incidents": 0,
        "maintenance_gap_days": 0,
        "worker_exposure": 1,
    }

    for col, val in defaults.items():
        if col not in df.columns:
            df[col] = val

    # -------------------------------
    # 🔥 FIXED CATEGORICAL MAPPING
    # -------------------------------

    # Ventilation
    df["ventilation_condition"] = (
        get_series(df, "ventilation_condition")
        .replace({"good": 1, "moderate": 2, "average": 2, "poor": 3, "bad": 3})
        .fillna(1)
    )

    # Water Level
    df["water_level_condition"] = (
        get_series(df, "water_level_condition")
        .replace({"low": 1, "normal": 2, "medium": 2, "moderate": 2, "high": 3})
        .fillna(2)
    )

    # Optional fields
    if "visible_gas_odor" in df.columns:
        df["visible_gas_odor"] = (
            get_series(df, "visible_gas_odor").map({"yes": 1, "no": 0}).fillna(0)
        )

    if "safety_equipment_available" in df.columns:
        df["safety_equipment_available"] = (
            get_series(df, "safety_equipment_available")
            .map({"yes": 1, "no": 0})
            .fillna(1)
        )

    # -------------------------------
    # 🔥 NUMERIC CLEANING (SAFE)
    # -------------------------------
    numeric_cols = [
        "gas_level_ppm",
        "oxygen_level_percent",
        "rainfall_last_24h_mm",
        "temperature_c",
        "humidity_percent",
        "number_of_workers",
        "expected_work_duration_minutes",
        "sewer_depth_m",
        "past_incidents",
        "maintenance_gap_days",
        "worker_exposure",
    ]

    for col in numeric_cols:
        df[col] = pd.to_numeric(get_series(df, col), errors="coerce").fillna(0)

    # -------------------------------
    # 🔥 FEATURE ENGINEERING (SAFE)
    # -------------------------------
    rain = get_series(df, "rainfall_last_24h_mm")
    water = get_series(df, "water_level_condition")

    df["gas_oxygen_ratio"] = df["gas_level_ppm"] / (df["oxygen_level_percent"] + 1)
    df["rain_water_risk"] = rain * water
    df["maintenance_risk"] = df["maintenance_gap_days"] * (df["past_incidents"] + 1)
    df["worker_risk"] = df["number_of_workers"] * df["worker_exposure"]

    df["oxygen_deficit"] = 21 - df["oxygen_level_percent"]
    df["exposure_risk"] = df["number_of_workers"] * df["expected_work_duration_minutes"]
    df["combined_risk"] = df["gas_level_ppm"] * df["ventilation_condition"]

    # -------------------------------
    # ✅ FINAL REQUIRED FEATURES
    # -------------------------------
    required_columns = [
        "gas_level_ppm",
        "oxygen_level_percent",
        "water_level_condition",
        "rainfall_last_24h_mm",
        "temperature_c",
        "humidity_percent",
        "number_of_workers",
        "expected_work_duration_minutes",
        "sewer_depth_m",
        "ventilation_condition",
        "past_incidents",
        "maintenance_gap_days",
        "worker_exposure",
    ]

    for col in required_columns:
        if col not in df.columns:
            df[col] = 0

    df = df[required_columns]

    print("\n✅ Preprocessing completed")
    print("Final columns:\n", df.columns.tolist())

    return df
