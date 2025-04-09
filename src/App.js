import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from "react-router-dom";

import Dashboard from "./Components/Dashboard/Dashboard";
import Groups from "./Components/Groups/Groups";
import GroupDetails from "./Components/Groups/GroupDetails";
import Subscribers from "./Components/Subscribers/Subscribers";
import Campaigns from "./Components/Campaigns/Campaigns";

import { GroupProvider } from "./Context/GroupProvider"; // ✅ import the provider

import "./App.css";

function Sidebar() {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <button onClick={() => navigate("/")}>Dashboard</button>
      <button onClick={() => navigate("/campaigns")}>Campaigns</button>
      <button onClick={() => navigate("/groups")}>Groups</button>
      <button onClick={() => navigate("/subscribers")}>Subscribers</button>
    </div>
  );
}

// Separate wrapper for GroupDetails to use useParams inside Routes
function GroupDetailsWrapper() {
  const { id } = useParams();
  return <GroupDetails groupID={id} />;
}

function App() {
  return (
    <GroupProvider> {/* ✅ Wrap entire app inside GroupProvider */}
      <Router>
        <div className="app-container">
          <Sidebar />
          <div className="content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/campaigns" element={<Campaigns />} />
              <Route path="/groups" element={<Groups />} />
              <Route path="/groups/:id" element={<GroupDetailsWrapper />} />
              <Route path="/subscribers" element={<Subscribers />} />
            </Routes>
          </div>
        </div>
      </Router>
    </GroupProvider>
  );
}

export default App;



/* {/* Campaign Popup }
{showCampaignPopup && <CampaignPopup onClose={() => setShowCampaignPopup(false)} />}*/

//<Route path="/groups/:id" element={<GroupDetails />} /> {/* Group Details */}