import { useState } from "react";
//import CampaignPopups from "./Components/CampaignPopups/CampaignPopup";
import Dashboard from "./Components/Dashboard/Dashboard";
import Groups from "./Components/Groups/Groups";
import Subscribers from "./Components/Subscribers/Subscribers";
import Campaigns from "./Components/Campaigns/Campaigns";
import "./App.css";

function App() {
  const [selectedTab, setSelectedTab] = useState("Campaigns");
  const [showCampaignPopup, setShowCampaignPopup] = useState(false);

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar">
        
        <button onClick={() => setSelectedTab("Dashboard")}>Dashboard</button>
        <button onClick={() => setSelectedTab("Campaigns")}>Campaigns</button>
        <button onClick={() => setSelectedTab("Groups")}>Groups</button>
        <button onClick={() => setSelectedTab("Subscribers")}>Subscribers</button>
      </div>

      {/* Main Content Area */}
      <div className="content">
        {selectedTab === "CampaignPopups" && <Campaigns setShowCampaignPopup={setShowCampaignPopup} />}
        {selectedTab === "Dashboard" && <Dashboard />}
        {selectedTab === "Campaigns" && <Campaigns/>}
        {selectedTab === "Groups" && <Groups />}
        {selectedTab === "Subscribers" && <Subscribers />}
      </div>

     
    </div>
  );
}

export default App;


/* {/* Campaign Popup }
{showCampaignPopup && <CampaignPopup onClose={() => setShowCampaignPopup(false)} />}*/