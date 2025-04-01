import CampaignPopup from "./CampaignPopup";

function Campaigns({ setShowCampaignPopup }) {
  return (
    <div>
      <h2>Campaigns</h2>
      <button className="primary-button" onClick={() => setShowCampaignPopup(true)}>
        Create Campaign
      </button>
    </div>
  );
  
}

export default Campaigns;
