const express = require("express");
//const mysql = require("mysql");
const mysql = require('mysql2');
const cors = require("cors");
const axios = require("axios");
const bodyParser = require("body-parser");
const https = require("https");


const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
const agent = new https.Agent({
  rejectUnauthorized: false, // ⚠️ Not for production! Only for localhost testing.
});

 const API_KEY = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiMzM5ZDZmYzVmM2ZiNDU1NWI3MGQ5NzNhNjRlMzUwOTBiOWM4YTA3ZmNkN2JlMDJjOTdkZmZhNzA3MzA3MmQ4Yjk4YmY0MGI3MmE3ZDIyMDkiLCJpYXQiOiIxNzQyMjgwMzkzLjk1MjEzOSIsIm5iZiI6IjE3NDIyODAzOTMuOTUyMTQyIiwiZXhwIjoiNDg5NTg4MDM5My45NTEwNDAiLCJzdWIiOiI5NTc0MjgiLCJzY29wZXMiOltdfQ.ce-WOFEAbK3NOcnrldS6YRkVrP3gImx4g4Cm84wL3TKvwsyhAzPI_t0LwIXDfZQQQzIW0v9IfskUTkl8LD1MsA"; // Keep this secret
//const API_KEY=  "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiNDUwMTU0OTM5N2ZhY2Q4NTkwYjAxOTI0MmNlOTg1YjRjMTQ5MjYwYzcyZWRiMDRmM2JlODVjZTA2MzI3YTg5ZTFkZjE0Y2NkMzIzZDFhZjAiLCJpYXQiOiIxNzQwNzQzNDQzLjQ4ODQ4MiIsIm5iZiI6IjE3NDA3NDM0NDMuNDg4NDg0IiwiZXhwIjoiNDg5NDM0MzQ0My40ODY5ODQiLCJzdWIiOiI5NTc0MjgiLCJzY29wZXMiOltdfQ.T37PZyBoY08dJ75Gfgf4l4_K0KL5GEeu0o3jCn9owWLWTWLbHlA-ZQCwpv9Xy5iUR_GAQDs-vMa26Wi0bcgRzA";

// Database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root", // Change if needed
  password: "root", // Change if needed
  database: "srila",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to MySQL database.");
});

// Bulk insert users
app.post("/api/users/bulk", (req, res) => {
  try {
    const users = req.body.users;

    if (!Array.isArray(users) || users.length === 0) {
      return res.status(400).json({ error: "Invalid data format" });
    }

    const values = users.map((user) => [
      user.action || "",
      user.contact_name || "",
      user.title || "",
      user.email || "",
      user.phone || "",
      user.engagement_status || "",
    ]);

    const insertQuery = `
      INSERT INTO users (action, contact_name, title, email, phone, engagement_status)
      VALUES ?
    `;

    db.query(insertQuery, [values], (err, result) => {
      if (err) {
        console.error("Error inserting users:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.json({ message: "Users imported successfully", inserted: result.affectedRows });
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Fetch all users
app.get("/api/users", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Insert a single user
app.post("/api/users", (req, res) => {
  const { action, contact_name, title, email, phone, engagement_status } = req.body;

  if (!contact_name || !email) {
    return res.status(400).json({ error: "Contact name and email are required" });
  }

  db.query(
    "INSERT INTO users (action, contact_name, title, email, phone, engagement_status) VALUES (?, ?, ?, ?, ?, ?)",
    [action, contact_name, title, email, phone, engagement_status],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "User added successfully", id: result.insertId });
    }
  );
});

app.post("/api/create-campaign", async (req, res) => {
  const campaignData = req.body;

  try {
    const response = await axios.post("https://api.sender.net/v2/campaigns", campaignData, {
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      }
    });

    //console.log("Full response from Sender.net:", JSON.stringify(response.data, null, 2));
    //const { data } = response.data; // first 'data' is from axios response, second is the payload

    //const campaignId = data?.id;
    //const campaignGroups = data?.campaign_groups;
    
    const responseData = response.data.data;
    const campaignId = responseData.id;

    //const campaignId = responseData.id || "Unidentified";
    const campaignGroups = responseData?.campaign_groups || [];

    console.log("Sender.net response data:", responseData);
    //console.log("Backend raw campaignGroups:", data["campaign_groups"]);
   // Extract specific fields
    //const campaignId = response.data?.data?.id;
    //const campaignGroups = response.data?.data?.campaign_groups;

    console.log("Campaign ID:", campaignId);
    console.log("Campaign Groups:", campaignGroups);

    // Send specific data to frontend (optional)
    //res.status(200).json({
    //  message: "Campaign created successfully",
    //  campaignId,
    //  campaignGroups,
    //});


    res.status(200).json({
      message: "Campaign created successfully",
      data: response.data.data, // <-- make sure this is correct
    });
    
  } catch (error) {
    console.error("Error sending campaign:", error?.response?.data || error.message);
    res.status(500).json({ error: "Failed to send campaign" });
  }
});

app.post("/api/send-campaign", async (req, res) => {
  const { campaignId } = req.body;

  if (!campaignId) {
    return res.status(400).json({ error: "Missing campaignId" });
  }

  try {
    const response = await axios.post(
      `https://api.sender.net/v2/campaigns/${campaignId}/send`,
      {}, // POST body is empty as per Sender.net
      {
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      }
    );

    console.log("Campaign sent:", response.data);
    res.status(200).json({ message: "Campaign sent successfully", data: response.data });
  } catch (error) {
    console.error("Error sending campaign:", error?.response?.data || error.message);
    res.status(500).json({ error: "Failed to send campaign" });
  }
});


app.get("/api/get-groups-list", async (req, res) => { 
  try {
    const response = await axios.get("https://api.sender.net/v2/groups", {
      headers: {
        "Authorization": `Bearer ${API_KEY}`, // Ensure this is correct
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    });

    console.log("Groups fetched successfully:", response.data);
    res.json(response.data); // Send response to frontend
  } catch (error) {
    console.error("Error fetching groups from Sender.net:", error?.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch groups" });
  }
});


// Endpoint to fetch subscribers of a specific group
app.get("/api/get-subscribers/:groupId", async (req, res) => {
  const { groupId } = req.params;
  const url = `https://api.sender.net/v2/groups/${groupId}/subscribers`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    // Extract relevant data
    const subscribers = response.data.data.map((subscriber) => ({
      email: subscriber.email,
      firstName: subscriber.firstname || "N/A",
      lastName: subscriber.lastname || "N/A",
      phone: subscriber.phone || "N/A",
    }));

    res.json({ subscribers });
  } catch (error) {
    console.error("Error fetching subscribers:", error.message);
    res.status(500).json({ error: "Failed to fetch subscribers" });
  }
});


// Update user
app.put("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const { action, contact_name, title, email, phone, engagement_status } = req.body;

  if (!contact_name || !email) {
    return res.status(400).json({ error: "Contact name and email are required" });
  }

  db.query(
    "UPDATE users SET action = ?, contact_name = ?, title = ?, email = ?, phone = ?, engagement_status = ? WHERE id = ?",
    [action, contact_name, title, email, phone, engagement_status, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({ message: "User updated successfully" });
    }
  );
});

// Delete user
app.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM users WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

/*   app.post("/api/asend-email2", async (req, res) => {

console.log("Boy, I have reached send-email endpoint");
const headers = {
    "Authorization": `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
    "Accept": "application/json",
  };
  //const subscriberId = req.body.subscriber_id;
const campaignData = {
    name: "Test Campaign",
    subject: req.body.subject,
    sender_email: req.body.sender_email,
    list_id: req.body.list_id,
    content: req.body.content,
};

console.log("Sending Campaign Data:", campaignData);
const url = `https://api.sender.net/v2/subscribes/{pavana.inspire@gmail.com}`;
//const url = `https://api.sender.net/v2/subscribers/${campaignData.list_id}`;
try {
  const response = await fetch(url, {
      method: "PATCH",
      headers,
      body: JSON.stringify(campaignData),
  });

  const result = await response.json();
  console.log("Subscriber Updated:", result);
} catch (error) {
  console.error(" Error updating subscriber:", error);
}
  
});  */

/* app campaign 4 ID : eZQvXv */
/* app campaign ID 3: el47qV */

/*const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
    const result = await response.json();*/


/*let url = "https://api.sender.net/v2/subscribers/r2DLRlW";
    const response = await axios.get("https://api.sender.net/v2/lists", {
      headers: {
        Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiNDUwMTU0OTM5N2ZhY2Q4NTkwYjAxOTI0MmNlOTg1YjRjMTQ5MjYwYzcyZWRiMDRmM2JlODVjZTA2MzI3YTg5ZTFkZjE0Y2NkMzIzZDFhZjAiLCJpYXQiOiIxNzQwNzQzNDQzLjQ4ODQ4MiIsIm5iZiI6IjE3NDA3NDM0NDMuNDg4NDg0IiwiZXhwIjoiNDg5NDM0MzQ0My40ODY5ODQiLCJzdWIiOiI5NTc0MjgiLCJzY29wZXMiOltdfQ.T37PZyBoY08dJ75Gfgf4l4_K0KL5GEeu0o3jCn9owWLWTWLbHlA-ZQCwpv9Xy5iUR_GAQDs-vMa26Wi0bcgRzA`,
      },
    });
    console.log(response.data);
    


    let headers = {
      "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiNDUwMTU0OTM5N2ZhY2Q4NTkwYjAxOTI0MmNlOTg1YjRjMTQ5MjYwYzcyZWRiMDRmM2JlODVjZTA2MzI3YTg5ZTFkZjE0Y2NkMzIzZDFhZjAiLCJpYXQiOiIxNzQwNzQzNDQzLjQ4ODQ4MiIsIm5iZiI6IjE3NDA3NDM0NDMuNDg4NDg0IiwiZXhwIjoiNDg5NDM0MzQ0My40ODY5ODQiLCJzdWIiOiI5NTc0MjgiLCJzY29wZXMiOltdfQ.T37PZyBoY08dJ75Gfgf4l4_K0KL5GEeu0o3jCn9owWLWTWLbHlA-ZQCwpv9Xy5iUR_GAQDs-vMa26Wi0bcgRzA ",
      "Content-Type": "applications/json",
      "Accept": "application/json",
    };
*/

/*list_id: req.body.list_id, // Ensure this is correct*/

/*try {
      const response = await axios.post(url, campaignData, { headers });
      console.log("✅ Campaign Created Successfully:", response.data);
      res.json(response.data);
  } catch (error) {
      console.error("Error sending email campaign:", error.response?.data || error.message);
      res.status(error.response?.status || 500).json({ error: "Failed to send campaign" });
  }*/


  /* Campaign 3 ID : er493B */

  /* Group 1 ID : epBDwm
    Sample ID : eg89EG */

/* Original-working api/send-email endpoint 
console.log(".. inside send-email endpoint, server.js");
  const { subject, content } = req.body;

  //const url = "https://api.sender.net/v2/campaigns";
  const headers = {
    Authorization: "Bearer [API_KEY]",
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  
  const data = {
    title: "App Created Campaign",
    subject: "Oh my God",
    from: "Sender support",
    reply_to: "support@listind.com",
    preheader: "App created campaign",
    content_type: "text",
    google_analytics: 1,
    auto_followup_subject: "Follow up subject",
    auto_followup_delay: 72,
    auto_followup_active: true,
    groups: ["epBDwm"],
    segments: [""],
    content: "Hello there",
  };
  
  try {
    

    const response = await axios.post(`https://api.sender.net/v2/campaigns`, JSON.stringify(data), headers);
   


    console.log("Data :", data);
    console.log("result :", result);
    //console.log("response :", response);

    if (!response.ok) throw new Error(result.message || "Failed to send email");

    res.json({ success: true, message: "Email campaign sent successfully!" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}); */