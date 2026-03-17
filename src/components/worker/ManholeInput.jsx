import { useState } from "react";

const ManholeInput = ({ onNavigate }) => {

  const [targetId, setTargetId] = useState("");

  return (
    <div className="map-controls">

      <input
        type="number"
        placeholder="Enter Manhole ID"
        value={targetId}
        onChange={(e) => setTargetId(e.target.value)}
      />

      <button onClick={() => onNavigate(targetId)}>
        Navigate
      </button>

    </div>
  );
};

export default ManholeInput;