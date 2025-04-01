function Dashboard() {
  return (
    <div>
      <h2>Dashboard</h2>
      <p>View and manage.</p>
    </div>
  );
}

export default Dashboard;



/* working popup with all functions in app.js 
const createCampaign = async () => {
    const campaignData = {
      title: "Example campaign 7",
      subject: "Example campaign 7 subject",
      from: "Sender support",
      reply_to: "support@listind.com",
      preheader: "Preview text of my campaign 7",
      content_type: "text",
      google_analytics: 1,
      auto_followup_subject: "Example follow up subject",
      auto_followup_delay: 72,
      auto_followup_active: true,
      groups: ["epBDwm", ],
      segments: [""],
      content: "Adding the first content of my campaign 7",
    };

    try {
      const response = await axios.post("http://localhost:5000/api/send-email", campaignData);

      console.log("Backend Response:", response.data);
      const campaignID = response.data.data.id;
      const campaignGroups = response.data.data.campaign_groups;

      //setCampaignId(campaignID);
      //setCampaignGroups(campaignGRP);  

      //const campaignId  = responseData.id;
      // const {campaignId, campaignGroups}  = response.data;

      // Store in ref
      campaignRef.current = {
        id: campaignID,
        groups: campaignGroups
      };
    
      console.log("Campaign ID:", campaignID);
      console.log("Campaign Groups:", campaignGroups);
  
      alert(`Campaign created successfully !\nID: ${campaignID}\nGroups: ${campaignGroups?.join(", ")}`);
      //alert(`Campaign created successfully !\nID: ${campaignId}`);
      setShowSendButton(true); // ✅ Show send button now

      //alert("Campaign created successfully!");
      console.log(response.data);
    } catch (error) {
      console.error("Error creating campaign:", error);
      alert("Failed to create campaign.");
    }
  };  

  
  const sendCampaign = async () => {    
    //const { id } = campaignRef.current;

    const { id, groups } = campaignRef.current;
      if (!id || !groups.length) {
        alert("Campaign data missing!");
        return;
      }

      //const payload = {
      //  campaignID: id,
      //  campaignGroups: groups,
      //};
    
    console.log (".... sending email campaign, campaignID:", id);
    try {
      //const response = await axios.post("http://localhost:5000/api/send-campaign", {
      // id, 
      //});
      //await axios.post("http://localhost:5000/api/send-campaign", payload);
     
      const response = await axios.post("http://localhost:5000/api/send-campaign", {
        campaignId: id
      });

      alert("Campaign sent successfully!");
      console.log(response.data);
      setShowSendButton(false);
      setShowCampaignPopup(false);
    } catch (error) {
      console.error("Error sending campaign:", error);
      alert("Failed to send campaign.");
    }
  };
  
  ....and....
  
{showCampaignPopup && (
        <CampaignPopup
          emailSubject={emailSubject}
          setEmailSubject={setEmailSubject}
          emailContent={emailContent}
          setEmailContent={setEmailContent}
          createCampaign={createCampaign}
          sendCampaign={sendCampaign}
          showSendButton={showSendButton}
          onClose={() => setShowCampaignPopup(false)}
        />
      )}
  */

/* Working popup window ---
{showCampaignPopup && (
        <div className="popup-container">
          <div className="popup">
            <h2>Create Email Campaign</h2>
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
      )}   */

/*{
          headers: {
            Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiNDUwMTU0OTM5N2ZhY2Q4NTkwYjAxOTI0MmNlOTg1YjRjMTQ5MjYwYzcyZWRiMDRmM2JlODVjZTA2MzI3YTg5ZTFkZjE0Y2NkMzIzZDFhZjAiLCJpYXQiOiIxNzQwNzQzNDQzLjQ4ODQ4MiIsIm5iZiI6IjE3NDA3NDM0NDMuNDg4NDg0IiwiZXhwIjoiNDg5NDM0MzQ0My40ODY5ODQiLCJzdWIiOiI5NTc0MjgiLCJzY29wZXMiOltdfQ.T37PZyBoY08dJ75Gfgf4l4_K0KL5GEeu0o3jCn9owWLWTWLbHlA-ZQCwpv9Xy5iUR_GAQDs-vMa26Wi0bcgRzA`, // Replace with your Sender.net API key
            "Content-Type": "application/json",
            Accept: "application/json",
          }  */

/* list_ids: ["your-list-id"], // Replace with actual list ID */

/* Original, working create campaign code --
console.log("Iam in createCampaigh()");

   if (!emailSubject || !emailContent) {
    alert("Email subject and content are required!");
    return;
  }
    const subject = "ABCD";

    const content = "ABCDESFDDD";
    
    try {
      const response = await axios.post(`http://localhost:5000/api/send-email`, {
        subject,
        content,
      });
    
      alert("Email campaign created successfully!");
    } catch (error) {
      console.error("Error creating campaign:", error);
      console.log("Oh I'm tired man ");
      alert(`Error: ${error.response?.data?.message || "Failed to create campaign"}`);
    }
        
    };  */

