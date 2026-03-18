import pandas as pd
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import classification_report


def train_model():

    print("Loading data...")

    df = pd.read_excel("data/training_data.xlsx")

    df = df.drop_duplicates()

    # Normalize columns
    df.columns = (
        df.columns.str.strip().str.lower().str.replace(" ", "_").str.replace("/", "_")
    )

    # -------------------------------
    # 🎯 TARGET
    # -------------------------------
    target = "label"

    df[target] = df[target].astype(str).str.strip().str.upper()

    df[target] = df[target].map({"SAFE": 0, "ALERT": 1, "DANGER": 2})

    df = df.dropna(subset=[target])

    # -------------------------------
    # ❌ REMOVE LEAKAGE FEATURES
    # -------------------------------
    drop_cols = [target, "maintenance_risk", "gas_oxygen_ratio", "rain_water_risk"]

    X = df.drop(columns=drop_cols, errors="ignore")

    # -------------------------------
    # 🔧 HANDLE CATEGORICAL
    # -------------------------------
    X = pd.get_dummies(X)

    X = X.fillna(0)

    y = df[target]

    print("Features:", X.columns.tolist())

    # -------------------------------
    # 🔀 SPLIT
    # -------------------------------
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.3, random_state=42, stratify=y
    )

    # -------------------------------
    # 🚀 MODEL (PRODUCTION LEVEL)
    # -------------------------------
    model = RandomForestClassifier(
        n_estimators=400,
        max_depth=12,
        min_samples_split=8,
        min_samples_leaf=4,
        class_weight="balanced",
        random_state=42,
    )

    print("Training model...")
    model.fit(X_train, y_train)

    # -------------------------------
    # 📊 EVALUATION
    # -------------------------------
    y_pred = model.predict(X_test)

    print("\nModel Performance:\n")
    print(classification_report(y_test, y_pred))

    # -------------------------------
    # 🔁 CROSS VALIDATION
    # -------------------------------
    scores = cross_val_score(model, X, y, cv=5)
    print("\nCross-validation scores:", scores)
    print("Average accuracy:", scores.mean())

    # -------------------------------
    # 🔥 FEATURE IMPORTANCE
    # -------------------------------
    importance = pd.Series(model.feature_importances_, index=X.columns)
    print("\nFeature Importance:\n")
    print(importance.sort_values(ascending=False).head(10))

    # -------------------------------
    # 💾 SAVE MODEL
    # -------------------------------

    # Save model
    joblib.dump(model, "models/risk_model.pkl")

    # Save feature order
    joblib.dump(X.columns.tolist(), "models/feature_columns.pkl")

    print("✅ Model + features saved!")


if __name__ == "__main__":
    train_model()
