import pandas as pd


def compute_final_risk(df):

    final_status = []
    risk_score = []
    reason = []

    for _, row in df.iterrows():

        score = 0
        reasons = []

        gas = row.get("gas_level_ppm", 0)
        oxygen = row.get("oxygen_level_percent", 21)
        ventilation = row.get("ventilation_condition", 1)
        water = row.get("water_level_condition", 1)

        # -------------------------------
        # 🚨 ABSOLUTE LIFE-CRITICAL RULES
        # -------------------------------
        if oxygen < 17:
            final_status.append("DANGER")
            risk_score.append(100)
            reason.append("Critical Oxygen")
            continue

        if gas > 110:
            final_status.append("DANGER")
            risk_score.append(100)
            reason.append("Extreme Gas")
            continue

        # -------------------------------
        # 🚨 REAL-WORLD KILLER CONDITIONS
        # -------------------------------
        if gas > 50 and ventilation >= 2:
            final_status.append("DANGER")
            risk_score.append(95)
            reason.append("Gas + Poor Ventilation")
            continue

        if water == 3 and gas > 40:
            final_status.append("DANGER")
            risk_score.append(90)
            reason.append("Gas + High Water")
            continue

        # 🔥 NEW: Oxygen + Gas combo (very dangerous)
        if oxygen < 18.5 and gas > 40:
            final_status.append("DANGER")
            risk_score.append(95)
            reason.append("Low Oxygen + Gas")
            continue

        # 🔥 NEW: High water alone can be dangerous
        if water == 3 and oxygen < 19:
            final_status.append("DANGER")
            risk_score.append(90)
            reason.append("Flooding + Low Oxygen")
            continue

        # -------------------------------
        # 🚨 SYSTEM OVERRIDE (CRITICAL)
        # -------------------------------
        if row.get("rule_status") == "DANGER":
            final_status.append("DANGER")
            risk_score.append(90)
            reason.append("Rule Engine Triggered")
            continue

        if row.get("ml_prediction") == 2 and row.get("ml_confidence", 0) > 0.6:
            final_status.append("DANGER")
            risk_score.append(85)
            reason.append("ML High Risk")
            continue

        # -------------------------------
        # 📊 BASE SCORING SYSTEM
        # -------------------------------

        # Gas
        if gas > 80:
            score += 35
            reasons.append("High Gas")
        elif gas > 50:
            score += 20
            reasons.append("Moderate Gas")

        # Oxygen
        if oxygen < 18:
            score += 35
            reasons.append("Low Oxygen")
        elif oxygen < 19:
            score += 20
            reasons.append("Borderline Oxygen")

        # Moderate boost
        if 45 <= gas <= 70:
            score += 10

        if 18 <= oxygen <= 19:
            score += 10

        # Ventilation
        if ventilation >= 2:
            score += 20
            reasons.append("Poor Ventilation")

        # Water
        if water == 3:
            score += 15
            reasons.append("High Water")

        # Maintenance
        if row.get("maintenance_gap_days", 0) > 60:
            score += 10
            reasons.append("Maintenance Delay")

        # Incidents
        if row.get("past_incidents", 0) > 2:
            score += 10
            reasons.append("Past Incidents")

        # -------------------------------
        # 🤖 ML INFLUENCE
        # -------------------------------
        ml = row.get("ml_prediction", 0)
        conf = row.get("ml_confidence", 0)

        if ml == 2:
            score += int(25 * conf)
        elif ml == 1:
            score += int(10 * conf)

        # -------------------------------
        # ⚠️ UNCERTAINTY
        # -------------------------------
        if row.get("uncertain", False):
            score += 8
            reasons.append("Uncertain Prediction")

        # -------------------------------
        # ⚠️ ANOMALY
        # -------------------------------
        if row.get("anomaly_flag", 0) == 1:
            score += 15
            reasons.append("Anomaly Detected")

        # -------------------------------
        # 🚨 SAFETY LOCK (NO FALSE SAFE)
        # -------------------------------
        if gas > 40 or oxygen < 19 or ventilation >= 2:
            score = max(score, 30)

        # -------------------------------
        # 🎯 FINAL DECISION
        # -------------------------------
        if score >= 75:
            status = "DANGER"
        elif score >= 30:
            status = "ALERT"
        else:
            status = "SAFE"

        final_status.append(status)
        risk_score.append(min(score, 100))
        reason.append(", ".join(reasons) if reasons else "Normal")

    # -------------------------------
    # ✅ SAVE RESULTS
    # -------------------------------
    df["final_status"] = final_status
    df["risk_score"] = risk_score
    df["risk_reason"] = reason

    return df
