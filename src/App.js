import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Dashboard from "./Components/Dashboard/Dashboard";
import Groups from "./Components/Groups/Groups";
import GroupDetails from "./Components/Groups/GroupDetails"; // Import GroupDetails component
import Subscribers from "./Components/Subscribers/Subscribers";
import Campaigns from "./Components/Campaigns/Campaigns";
import "./App.css";
import { useParams } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate(); // Hook for navigation

  function GroupDetails() {
    const { id } = useParams(); // Extracts the group ID from URL
    return <GroupDetails groupID={id} />;
  }

  return (
    <div className="sidebar">
      <button onClick={() => navigate("/")}>Dashboard</button>
      <button onClick={() => navigate("/campaigns")}>Campaigns</button>
      <button onClick={() => navigate("/groups")}>Groups</button>
      <button onClick={() => navigate("/subscribers")}>Subscribers</button>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar /> {/* Sidebar remains constant across all screens */}

        {/* Main Content Area */}
        <div className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/groups" element={<Groups />} />
            
            <Route path="/groups/:id" element={<GroupDetails />} />

            <Route path="/subscribers" element={<Subscribers />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;


/* {/* Campaign Popup }
{showCampaignPopup && <CampaignPopup onClose={() => setShowCampaignPopup(false)} />}*/

//<Route path="/groups/:id" element={<GroupDetails />} /> {/* Group Details */}