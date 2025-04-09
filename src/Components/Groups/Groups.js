import React, { useState } from "react";
import "./Groups.css";
import GroupPopup from "./GroupPopup";
import { useNavigate } from "react-router-dom";
import { useGroupState } from "../../Context/GroupProvider";

const Groups = () => {
  const [isPopupOpen, setPopupOpen] = useState(false);
  const navigate = useNavigate();
  const { groupList, loading, error } = useGroupState(); // ✅ from context

  const openPopup = () => setPopupOpen(true);
  const closePopup = () => setPopupOpen(false);

  const handleGroupClick = (groupId) => {
    navigate(`/groups/${groupId}`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading groups: {error.message}</div>;

  return (
    <div className="groups-container">
      <div className="groups-header">
        <h2>Groups</h2>
        <button className="create-group-btn" onClick={openPopup}>
          Create New Group
        </button>
      </div>

      <input
        type="text"
        className="groups-search-bar"
        placeholder="Filter groups..."
      />

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
            {groupList.map((group) => (
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

      {isPopupOpen && (
        <GroupPopup closePopup={closePopup} />
      )}
    </div>
  );
};

export default Groups;
