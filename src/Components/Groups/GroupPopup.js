import React, { useState } from "react";
import "./Groups.css";

const GroupPopup = ({ closePopup, setGroupName }) => {
  const [inputValue, setInputValue] = useState("");

  const handleSave = () => {
    setGroupName(inputValue); // Pass data back to parent
    closePopup(); // Close popup after saving
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        {/* Header */}
        <div className="popup-header">
          <h3>Create New Group</h3>
          <span className="close-btn" onClick={closePopup}>✖</span>
        </div>

        {/* Input Section */}
        <label className="group-label">Group Name</label>
        <input
          type="text"
          className="group-input"
          placeholder="Enter Group name"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />

        {/* Buttons */}
        <div className="popup-buttons">
          <button className="cancel-btn" onClick={closePopup}>Cancel</button>
          <button 
            className={`save-btn ${inputValue ? "active" : "inactive"}`} 
            onClick={handleSave}
            disabled={!inputValue}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupPopup;
