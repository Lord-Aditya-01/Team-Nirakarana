def compute_final_risk(df):

    final_status = []
    risk_score = []
    reason = []

    for _, row in df.iterrows():

        score = 0
        reasons = []

        gas = row["gas_level_ppm"]
        oxygen = row["oxygen_level_percent"]
        ventilation = row["ventilation_condition"]
        water = row["water_level_condition"]

        # -------------------------------
        # 🚨 HARD RULES (ONLY EXTREME)
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
        # 📊 BASE SCORING
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

        # 🔥 EXTRA BOOST (FIX FOR MODERATE)
        if 45 <= gas <= 70:
            score += 10
            reasons.append("Moderate Gas Range")

        if 18 <= oxygen <= 19:
            score += 10
            reasons.append("Borderline Oxygen Range")

        # Ventilation
        if ventilation == 2:
            score += 20
            reasons.append("Poor Ventilation")

        # Water
        if water == 3:
            score += 15
            reasons.append("High Water")

        # Maintenance
        if row["maintenance_gap_days"] > 60:
            score += 10

        # Incidents
        if row["past_incidents"] > 2:
            score += 10

        # -------------------------------
        # 🤖 ML INFLUENCE
        # -------------------------------
        ml = row["ml_prediction"]
        conf = row["ml_confidence"]

        if ml == 2:
            score += int(25 * conf)
        elif ml == 1:
            score += int(10 * conf)

        # -------------------------------
        # ⚠️ UNCERTAINTY
        # -------------------------------
        if row.get("uncertain", False):
            score += 8

        # -------------------------------
        # ⚠️ ANOMALY
        # -------------------------------
        if row.get("anomaly_flag", 0) == 1:
            score += 15

        # -------------------------------
        # 🚨 SAFETY LOCK (CRITICAL FIX)
        # -------------------------------
        if gas > 45 or oxygen < 19 or ventilation == 2:
            score = max(score, 30)  # ensures ALERT minimum

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

    df["final_status"] = final_status
    df["risk_score"] = risk_score
    df["risk_reason"] = reason

    return df
