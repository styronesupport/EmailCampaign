import React, { useState } from "react";

const CreateCampaign = ({ onClose }) => {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSendEmail = async () => {
    setLoading(true);
    setError(null);

    console.log("..inside CreateCampaign component");

    try {
      const response = await fetch("http://localhost:5000/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subject, content }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to send email");
      alert("Email campaign sent successfully!");
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Create Email Campaign</h2>
        <input
          type="text"
          placeholder="Enter Email Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <textarea
          placeholder="Enter Email Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        {error && <p className="error">{error}</p>}
        <button onClick={handleSendEmail} disabled={loading}>
          {loading ? "Sending..." : "Send"}
        </button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default CreateCampaign;
