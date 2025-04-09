// Campaigns.js
import React from "react";
import CampaignTable from "./CampaignTable";
import "./Campaigns.css";

function Campaigns({ setShowCampaignPopup }) {
  return (
    <div className="campaigns-container">
      <div className="campaigns-header">

        <h2>Email Campaigns</h2>
        <button
          className="new-campaign-button"
          onClick={() => setShowCampaignPopup(true)}
        >
          New Campaign
        </button>
      </div>
      <CampaignTable />
    </div>
  );
}

export default Campaigns;

