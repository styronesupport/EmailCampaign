// components/CampaignPopup.jsx
import React, { useState, useEffect, useRef} from "react";
import axios from "axios";
import "./CampaignPopup.css"; // optional: for styling

const CampaignPopup = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState("compose");

  const [emailSubject, setEmailSubject] = useState("");
  const [emailContent, setEmailContent] = useState("");
  //const [previewContent, setPreviewContent] = useState("");
  const [campaignTitle, setCampaignTitle] = useState("");
  const [preheader, setPreheader] = useState("");
  const [fromName, setFromName] = useState("");
  const [replyToEmail, setReplyToEmail] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [showSendButton, setShowSendButton] = useState(false);
  const campaignRef = useRef({});

  useEffect(() => {
    // Lock background scroll
    document.body.classList.add("modal-open");

    // Cleanup: restore scroll when popup unmounts
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);
  

  const createCampaign = async () => {
  const campaignData = {
    title: campaignTitle,
    subject: emailSubject,
    from: fromName,
    reply_to: replyToEmail,
    preheader: preheader,
    content_type: "text",
    google_analytics: 1,
    auto_followup_subject: "Follow up subject",
    auto_followup_delay: 72,
    auto_followup_active: true,
    groups: [selectedGroup],
    segments: [""],
    content: emailContent,
  };


  try {
    const response = await axios.post("http://localhost:5000/api/create-campaign", campaignData);
    const campaignID = response.data.data.id;
    const campaignGroups = response.data.data.campaign_groups;

    campaignRef.current = { id: campaignID, groups: campaignGroups };
    setShowSendButton(true);
    alert(`Campaign created successfully!\nID: ${campaignID}`);
  } catch (error) {
    console.error("Error creating campaign:", error);
    alert("Failed to create campaign.");
  }
};

const sendCampaign = async () => {
  const { id, groups } = campaignRef.current;

  if (!id || !groups.length) {
    alert("Missing campaign data.");
    return;
  }

  try {
    await axios.post("http://localhost:5000/api/send-campaign", {
      campaignId: id,
      campaignGroups: groups,
    });
    alert("Campaign sent successfully!");
    setShowSendButton(false); // Hide send button after successful send
    
  } catch (error) {
    console.error("Error sending campaign:", error);
    alert("Failed to send campaign.");
  }
};

const openPreviewWindow = () => {
  const previewWindow = window.open("", "Preview", "width=600,height=400");
  previewWindow.document.write(`
    <html>
      <head>
        <title>Email Preview</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .preview-content { border: 1px solid #ddd; padding: 10px; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <h3>Email Preview</h3>
        <div class="preview-content">${emailContent}</div>
        <button onclick="window.close()">Cancel</button>
      </body>
    </html>
  `);
};

return (
  <div className="popup-container">
    <div className="popup">
      <h2>Create Email Campaign</h2>

      <input type="text" placeholder="Campaign Title" value={campaignTitle} onChange={(e) => setCampaignTitle(e.target.value)} />
      <input type="text" placeholder="Email Subject" value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} />
      <input type="text" placeholder="Preheader" value={preheader} onChange={(e) => setPreheader(e.target.value)} />
      <input type="text" placeholder="From Name" value={fromName} onChange={(e) => setFromName(e.target.value)} />
      <input type="email" placeholder="Reply-to Email" value={replyToEmail} onChange={(e) => setReplyToEmail(e.target.value)} />
      <input type="text" placeholder="Group ID" value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)} />
      <textarea placeholder="Enter email content" value={emailContent} onChange={(e) => setEmailContent(e.target.value)} rows={6}></textarea>

      <div className="popup-buttons">
        <button className="secondary-button" onClick={openPreviewWindow}>Preview</button>
        <button className="primary-button" onClick={createCampaign}>Create</button>
        <button className="secondary-button" onClick={onClose}>Cancel</button>
        {showSendButton && <button className="send-button" onClick={sendCampaign}>Send Campaign</button>}
      </div>
    </div>
  </div>
);
};

export default CampaignPopup;


/*
Working popup with compose, preview, create and cancel
return (
    <div className="popup-container">
      <div className="popup">
        <h2>Create Email Campaign</h2>
  
        {/* Tab Buttons }
        <div className="tab-buttons">
          <button
            className={activeTab === "compose" ? "active" : ""}
            onClick={() => setActiveTab("compose")}
          >
            Compose
          </button>
          <button
            className={activeTab === "preview" ? "active" : ""}
            onClick={() => setActiveTab("preview")}
          >
            Preview
          </button>
        </div>
  
        {/* Compose Tab }
        {activeTab === "compose" && (
          <>
            <input
              type="text"
              placeholder="Campaign Title"
              value={campaignTitle}
              onChange={(e) => setCampaignTitle(e.target.value)}
            />
            <input
              type="text"
              placeholder="Email Subject"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
            />
            <input
              type="text"
              placeholder="Preheader"
              value={preheader}
              onChange={(e) => setPreheader(e.target.value)}
            />
            <input
              type="text"
              placeholder="From Name"
              value={fromName}
              onChange={(e) => setFromName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Reply-to Email"
              value={replyToEmail}
              onChange={(e) => setReplyToEmail(e.target.value)}
            />
            <input
              type="text"
              placeholder="Group ID"
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
            />
            <textarea
              placeholder="Enter email content"
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              rows={6}
            ></textarea>
          </>
        )}
  
        {/* Preview Tab }
        {activeTab === "preview" && (
          <div className="preview-container">
            <h3>Email Preview</h3>
            <div
              className="preview-content"
              dangerouslySetInnerHTML={{ __html: emailContent }}
            ></div>
          </div>
        )}
  
        {/* Buttons }
        <div className="popup-buttons">
          <button className="primary-button" onClick={createCampaign}>
            Create
          </button>
          {showSendButton && (
            <button className="send-button" onClick={sendCampaign}>
              Send Campaign
            </button>
          )}
          <button className="secondary-button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
  

};

export default CampaignPopup; */


/* Working return for popup



  return (
    <div className="campaign-popup-container">
      <div className="campaign-popup">
        <h2>Create Email Campaign</h2>

        {/* Tab Buttons }
        <div className="campaign-tab-buttons">
          <button
            className={activeTab === "compose" ? "active" : ""}
            onClick={() => setActiveTab("compose")}
          >
            Compose
          </button>
          <button
            className={activeTab === "preview" ? "active" : ""}
            onClick={() => setActiveTab("preview")}
          >
            Preview
          </button>
        </div>

        {/* Compose Tab}
        {activeTab === "compose" && (
          <>
            <input
              type="text"
              placeholder="Email Subject"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
            />
            <textarea
              placeholder="Enter email content"
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              rows={6}
            ></textarea>
          </>
        )}

        {/* Preview Tab }
        {activeTab === "preview" && (
          <div className="campaign-preview-container">
            <h3>Email Preview</h3>
            <div
              className="campaign-preview-content"
              dangerouslySetInnerHTML={{ __html: emailContent }}
            ></div>
          </div>
        )}

        {/* Action Buttons }
        <div className="campaign-popup-buttons">
          {activeTab === "compose" && (
            <button className="campaign-primary-button" onClick={createCampaign}>
              Create
            </button>
          )}
          {showSendButton && (
            <button onClick={sendCampaign} style={{ marginTop: "10px" }}>
              Send Campaign
            </button>
          )}
          <button className="campaign-secondary-button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );  */


/*  Working popup - app.js
{showCampaignPopup && (
  <div className="campaign-campaign-popup-container">
    <div className="popup">
      <h2>Create Email Campaign</h2>

      <input
        type="text"
        placeholder="Campaign Title"
        value={campaignTitle}
        onChange={(e) => setCampaignTitle(e.target.value)}
      />
      
      <input
        type="text"
        placeholder="Email Subject"
        value={emailSubject}
        onChange={(e) => setEmailSubject(e.target.value)}
      />

      <input
        type="text"
        placeholder="Preheader (optional)"
        value={preheader}
        onChange={(e) => setPreheader(e.target.value)}
      />

      <input
        type="text"
        placeholder="From (Sender Name)"
        value={fromName}
        onChange={(e) => setFromName(e.target.value)}
      />

      <input
        type="email"
        placeholder="Reply-To Email"
        value={replyToEmail}
        onChange={(e) => setReplyToEmail(e.target.value)}
      />

      <select value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)}>
        <option value="">Select Group</option>
        <option value="epBDwm">Test Group 1</option>
        {/* Add more group options here }
        </select>

        <textarea
          placeholder="Enter email content"
          value={emailContent}
          onChange={(e) => setEmailContent(e.target.value)}
        ></textarea>
  
        <div className="popup-buttons">
          <button onClick={() => setPreviewContent(emailContent)}>Preview</button>
  
          <button className="primary-button" onClick={createCampaign}>Create</button>
  
          {showSendButton && (
            <button onClick={sendCampaign} style={{ marginTop: '10px' }}>
              Send Campaign
            </button>
          )}
  
          <button className="secondary-button" onClick={() => setShowCampaignPopup(false)}>Cancel</button>
        </div>
  
        {previewContent && (
          <div className="preview-container">
            <h3>Email Preview</h3>
            <div className="preview-content" dangerouslySetInnerHTML={{ __html: previewContent }}></div>
          </div>
        )}
      </div>
    </div>
  )} */
