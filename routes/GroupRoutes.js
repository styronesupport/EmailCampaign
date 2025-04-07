const express = require("express");
const router = express.Router();
const axios = require("axios");

const API_KEY = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiMzM5ZDZmYzVmM2ZiNDU1NWI3MGQ5NzNhNjRlMzUwOTBiOWM4YTA3ZmNkN2JlMDJjOTdkZmZhNzA3MzA3MmQ4Yjk4YmY0MGI3MmE3ZDIyMDkiLCJpYXQiOiIxNzQyMjgwMzkzLjk1MjEzOSIsIm5iZiI6IjE3NDIyODAzOTMuOTUyMTQyIiwiZXhwIjoiNDg5NTg4MDM5My45NTEwNDAiLCJzdWIiOiI5NTc0MjgiLCJzY29wZXMiOltdfQ.ce-WOFEAbK3NOcnrldS6YRkVrP3gImx4g4Cm84wL3TKvwsyhAzPI_t0LwIXDfZQQQzIW0v9IfskUTkl8LD1MsA"; // Keep this secret

// DELETE subscribers from Sender.net group
router.delete("/api/delete-subscribers/:groupID", async (req, res) => {
    const groupID = req.params.groupID;
    const { subscribers } = req.body;

    try {
        const response = await axios.delete(`https://api.sender.net/v2/subscribers/groups/${groupID}`, {
            headers: {
                Authorization: `Bearer ${API_KEY}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            data: {
                subscribers: subscribers,
            },
        });

        res.status(200).json({ message: "Subscribers deleted successfully", data: response.data });
    } catch (error) {
        console.error("Error deleting subscribers from group:", error.response?.data || error.message);
        res.status(500).json({ message: "Failed to delete subscribers", error: error.response?.data || error.message });
    }
});

module.exports = router;
