import WorkerHeader from "./WorkerHeader";
import LocationMap from "./LocationMap";
import GasStatus from "./GasStatus";
import SOSButton from "./SOSButton";
import WorkStatus from "./WorkStatus";
import "./worker.css";
import { useEffect, useState } from "react";
import socket from "../../socket";

const WorkerDashboard = () => {

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
        
        <LocationMap />

        <GasStatus />

        <SOSButton />

        <WorkStatus />

        <div>Worker Tracking Active</div>

      </div>

    </div>
  );
};
export default WorkerDashboard;
