import React, { useState, useEffect } from "react";
import "./Groups.css";
import GroupPopup from "./GroupPopup"; // Import popup component
import axios from "axios";
import { useNavigate } from "react-router-dom";



const Groups = () => {
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [groupName, setGroupName] = useState(""); // Store the entered group name
  const [groups, setGroups] = useState([]);  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const openPopup = () => setPopupOpen(true);
  const closePopup = () => setPopupOpen(false);

  const navigate = useNavigate();

  //const groups = [
   // { id: "epBDwm", name: "Group A" },
   // { id: 2, name: "Group B" },
  //];

  useEffect(() => {
    // Define an async function inside useEffect
    const fetchGroups = async () => {
      try {
        // Perform the API call using axios
        //const response = await axios.get("/api/get-groups-list");
        const response = await axios.get("http://localhost:5000/api/get-groups-list");
        console.log("Fetched groups:", response.data); // Log the response data
        setGroups(response.data.data);  // Assuming `data` contains the list of groups
        setLoading(false);
      } catch (error) {
        console.error("Error fetching groups:", error);
        setError(error);
        setLoading(false);
      }
    };

    // Call the async function
    fetchGroups();
  }, []); // Empty dependency array means this effect runs once after the component mounts

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading groups: {error.message}</div>;

  const handleGroupClick = (groupId) => {
    console.log("inside handleGroupClick - Groups.js...");
    navigate(`/groups/${groupId}`);  // Navigate to GroupDetails with the groupId
};

  return (
    <div className="groups-container">
      {/* Header with Title and Button */}
      <div className="groups-header">
        <h2>Groups</h2>
        <button className="create-group-btn" onClick={openPopup}>Create New Group</button>
      </div>

      {/* Search Bar */}
      <input
        type="text"
        className="groups-search-bar"
        placeholder="Filter groups..."
      />

      {/* Groups Table */}
      <div className="groups-table-container">
        <table className="groups-table">
          <thead>
            <tr>
              <th>Groups</th>
              <th>Active</th>
              <th>Total</th>
              <th>Unsubscribed</th>
              <th>Bounced</th>
            </tr>
          </thead>
          <tbody>
            {/* Sample Row */}
            {groups.map((group) => (
            <tr key={group.id} onClick={() => handleGroupClick(group.id)} style={{ cursor: "pointer" }}>
              <td>{group.title}</td>
              <td>{group.active_subscribers}</td>
              <td>{group.recipient_count}</td>
              <td>{group.unsubscribed_count}</td>
              <td>{group.bounced_count}</td>
            </tr>
          ))}



          </tbody>
        </table>
      </div>

      {/* Popup Component */}
      {isPopupOpen && (
        <GroupPopup closePopup={closePopup} setGroupName={setGroupName} />
      )}

    </div>
  );
};

export default Groups;
