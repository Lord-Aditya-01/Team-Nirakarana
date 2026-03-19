def compute_safety_decision(df):

    entry_status = []
    safe_time = []
    decision_reason = []

    for _, row in df.iterrows():

        risk = row.get("final_status", "SAFE")

        gas = row.get("gas_level_ppm", 0)
        oxygen = row.get("oxygen_level_percent", 21)
        ventilation = row.get("ventilation_condition", 1)
        water = row.get("water_level_condition", 1)
        workers = row.get("number_of_workers", 1)
        duration = row.get("expected_work_duration_minutes", 30)
        work_type = row.get("type_of_work", "inspection")
        equipment = row.get("safety_equipment_available", 1)

        # -------------------------------
        # 🚨 STRICT RULE: DANGER = DENY
        # -------------------------------
        if risk == "DANGER":
            entry_status.append("DENY")
            safe_time.append(0)
            decision_reason.append("Danger: High risk environment")
            continue

        # -------------------------------
        # 🚨 HARD PHYSICAL DENIAL
        # -------------------------------
        if (
            oxygen < 18
            or gas > 90
            or (gas > 60 and ventilation >= 2)
            or (water == 3 and gas > 50)
        ):
            entry_status.append("DENY")
            safe_time.append(0)
            decision_reason.append("Critical atmospheric/environmental risk")
            continue

        # -------------------------------
        # 🧠 BASE TIME
        # -------------------------------
        time = 120

        # -------------------------------
        # 🔥 ATMOSPHERIC IMPACT
        # -------------------------------
        if gas > 70:
            time -= 60
        elif gas > 50:
            time -= 40
        elif gas > 30:
            time -= 20

        if oxygen < 18.5:
            time -= 60
        elif oxygen < 19:
            time -= 40
        elif oxygen < 20:
            time -= 20

        # -------------------------------
        # 🔥 STRUCTURE IMPACT
        # -------------------------------
        if ventilation >= 2:
            time -= 20

        # -------------------------------
        # 🔥 WATER IMPACT
        # -------------------------------
        if water == 3:
            time -= 25
        elif water == 2:
            time -= 10

        # -------------------------------
        # 🔥 WORK TYPE IMPACT
        # -------------------------------
        if work_type == "repair":
            time -= 25
        elif work_type == "cleaning":
            time -= 15
        else:
            time -= 5

        # -------------------------------
        # 🔥 WORKER COUNT (NON-LINEAR)
        # -------------------------------
        if workers >= 6:
            time -= 35
        elif workers >= 4:
            time -= 25
        elif workers >= 2:
            time -= 12

        # -------------------------------
        # 🔥 SAFETY EQUIPMENT IMPACT
        # -------------------------------
        if equipment == 0:
            time -= 30  # VERY IMPORTANT
        else:
            time += 10  # slight bonus

        # -------------------------------
        # 🔥 TASK DURATION EFFECT
        # -------------------------------
        if duration > 60:
            time -= 10

        # -------------------------------
        # 🔥 EXPOSURE MODEL
        # -------------------------------
        exposure_rate = 1

        if gas > 60:
            exposure_rate += 2
        elif gas > 40:
            exposure_rate += 1

        if oxygen < 19:
            exposure_rate += 2

        if ventilation >= 2:
            exposure_rate += 1

        if workers >= 3:
            exposure_rate += 1

        if equipment == 0:
            exposure_rate += 1

        time = int(time / exposure_rate)

        # -------------------------------
        # 🚨 PHYSIOLOGICAL SAFETY LIMIT
        # -------------------------------
        if oxygen < 19:
            time = min(time, 20)

        # -------------------------------
        # ⚠️ FINAL CLAMP
        # -------------------------------
        time = max(min(time, 120), 0)

        # -------------------------------
        # 🎯 FINAL DECISION
        # -------------------------------
        if time <= 0:
            entry_status.append("DENY")
            safe_time.append(0)
            decision_reason.append("No safe exposure possible")

        elif time <= 15:
            entry_status.append("LIMITED")
            safe_time.append(time)
            decision_reason.append("Very high risk exposure")

        elif time <= 45:
            entry_status.append("LIMITED")
            safe_time.append(time)
            decision_reason.append("Moderate risk exposure")

        else:
            entry_status.append("ALLOW")
            safe_time.append(time)
            decision_reason.append("Safe working conditions")

    df["entry_decision"] = entry_status
    df["safe_work_time_minutes"] = safe_time
    df["decision_reason"] = decision_reason

    return df
