import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Campaigns.css";
import "./CampaignTable.css";
import { FaPen, FaChevronDown } from "react-icons/fa";
import { useGroupState } from "../../Context/GroupProvider";  // context-based import

const CampaignTable = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [popup, setPopup] = useState({ visible: false, type: "", campaign: null });

  const { groupMap } = useGroupState(); // ✅ use context-based groupMap

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/campaigns");
        const rawCampaigns = res.data;

        const formatted = rawCampaigns.map((c) => ({
          ...c,
          groupNames: c.groups
            .split(",")
            .map((id) => groupMap[id.trim()] || id.trim())
            .join(", "),
        }));

        setCampaigns(formatted);
      } catch (err) {
        console.error("Failed to fetch campaigns:", err.message);
      }
    };

    // Only fetch campaigns after groupMap is populated
    if (Object.keys(groupMap).length > 0) {
      fetchCampaigns();
    }
  }, [groupMap]);

  const handleRectangleClick = (name) => {
    alert(`Popup for campaign: ${name}`);
  };

  return (
    <div className="campaign-table-container">
      <div>
        <input
          type="text"
          placeholder="Search campaign by name"
          className="campaign-search-bar"
        />
      </div>
      <table className="campaign-table">
        <thead>
          <tr>
            <th>Campaign</th>
            <th>Groups</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((c, index) => (
            <tr key={index}>
              <td className="campaign-name-cell">
                <div
                  className="campaign-square"
                  onClick={() => handleRectangleClick(c.name)}
                />
                <span>{c.name}</span>
              </td>
              <td>
                <div className="group-name-column">
                  {c.groupNames.split(", ").map((name, idx) => (
                    <div key={idx}>{name}</div>
                  ))}
                </div>
              </td>
              <td className="status-cell">
                <div className="status-subcol">
                  <span><strong>Delivered:</strong> {c.status.delivered}</span>
                  <span><strong>Opened:</strong> {c.status.opened}</span>
                  <span><strong>Clicked:</strong> {c.status.clicked}</span>
                </div>
              </td>
              <td className="actions-cell">
                <button className="action-btn"><FaPen /></button>
                <div className="dropdown-container">
                  <button className="action-btn"><FaChevronDown /></button>
                  <div className="dropdown-content">
                    <button onClick={() => setPopup({ visible: true, type: "delete", campaign: c })}>
                      Delete
                    </button>
                    <button onClick={() => setPopup({ visible: true, type: "send", campaign: c })}>
                      Send
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {popup.visible && (
        <div className="popup-overlay">
          <div className="popup-box">
            <div className="popup-message">
              Are you sure you want to {popup.type} <strong>{popup.campaign?.name}</strong>?
            </div>
            <div className="popup-buttons">
              <button
                className="popup-action-btn"
                onClick={() => {
                  alert(`${popup.type === "delete" ? "Deleting" : "Sending"} campaign ID: ${popup.campaign.campaign_id}`);
                  setPopup({ visible: false, type: "", campaign: null });
                }}
              >
                {popup.type === "delete" ? "Delete" : "Send"}
              </button>
              <button
                className="popup-cancel-btn"
                onClick={() => setPopup({ visible: false, type: "", campaign: null })}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignTable;
