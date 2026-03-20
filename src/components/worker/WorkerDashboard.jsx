import WorkerHeader from "./WorkerHeader";
import LocationMap from "./LocationMap";
import SOSButton from "./SOSButton";
import WorkStatus from "./WorkStatus";
import "./worker.css";
import { useEffect, useState } from "react";
import socket from "../../socket";
import ManholeNavigator from "./ManholeNavigator";

const WorkerDashboard = () => {
  const [position, setPosition] = useState([18.6770, 73.8987]);
  const [manholes, setManholes] = useState(null);
  const [worker, setWorker] = useState(null);

  useEffect(() => {
  socket.emit("get-worker-session");
  const handleWorkerUpdate = (data) => {
    setWorker(data);
  };
  socket.on("worker-session-data", handleWorkerUpdate);
  return () => {
    socket.off("worker-session-data", handleWorkerUpdate);
  };

}, []);


  if (!worker) {
    return <div>Loading worker data...</div>;
  }

  return (
    <div className="worker-dashboard">

      <div className="worker-container">

        <WorkerHeader worker={worker} />

        {/* GPS tracking handled inside LocationMap */}
        
        <LocationMap
          position={position}
          setPosition={setPosition}
          manholes={manholes}
          setManholes={setManholes}
        />
        {/* ✅ ADD HERE */}
        <ManholeNavigator
          position={position}
          manholes={manholes}
        />
        <GasStatus />

        <SOSButton />

        <WorkStatus />

        <div>Worker Tracking Active</div>

      </div>

    </div>
  );
};
export default WorkerDashboard;