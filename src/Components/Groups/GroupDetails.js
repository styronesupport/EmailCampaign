import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./GroupDetails.css";
import axios from "axios";

const GroupDetails = ({ groupID }) => {
    const navigate = useNavigate();
    const [subscribers, setSubscribers] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    useEffect(() => {
        if (!groupID) return; // Prevent API call if no group ID is provided

        const fetchSubscribers = async () => {
            try {
                const response = await axios.get(`https://api.sender.net/v2/groups/${groupID}/subscribers`, {
                    headers: {
                        "Authorization": "Bearer [your-token]",
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                    }
                });

                // Extract relevant subscriber data
                const formattedSubscribers = response.data.data.map(subscriber => ({
                    id: subscriber.id,
                    email: subscriber.email,
                    firstName: subscriber.firstname || "N/A",
                    lastName: subscriber.lastname || "N/A",
                    phone: subscriber.phone || "N/A",
                    selected: false,
                }));

                setSubscribers(formattedSubscribers);
            } catch (error) {
                console.error("Error fetching subscribers:", error);
            }
        };

        fetchSubscribers();
    }, [groupID]); // Re-fetch data if groupID changes

    const handleCheckboxChange = (id) => {
        setSubscribers(subscribers.map(subscriber =>
            subscriber.id === id ? { ...subscriber, selected: !subscriber.selected } : subscriber
        ));
    };

    const handleSelectAll = () => {
        const newSelectAll = !selectAll;
        setSelectAll(newSelectAll);
        setSubscribers(subscribers.map(subscriber => ({ ...subscriber, selected: newSelectAll })));
    };

    return (
        <div className="group-details-container">
            <h2 className="group-id">{groupID}</h2>
            <div className="buttons-container">
                <button className="add-subscriber" onClick={() => alert("Add Subscriber Screen")}>Add Subscriber</button>
                {subscribers.some(subscriber => subscriber.selected) && (
                    <button className="delete-subscriber">Delete Subscriber</button>
                )}
                <button onClick={() => navigate(-1)} style={{ backgroundColor: "blue", color: "white" }}>
                    Cancel
                </button>
            </div>
            <table className="subscribers-table">
                <thead>
                    <tr>
                        <th><input type="checkbox" checked={selectAll} onChange={handleSelectAll} /></th>
                        <th>Email</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Phone</th>
                    </tr>
                </thead>
                <tbody>
                    {subscribers.map(subscriber => (
                        <tr key={subscriber.id}>
                            <td>
                                <input type="checkbox" checked={subscriber.selected} onChange={() => handleCheckboxChange(subscriber.id)} />
                            </td>
                            <td>{subscriber.email}</td>
                            <td>{subscriber.firstName}</td>
                            <td>{subscriber.lastName}</td>
                            <td>{subscriber.phone}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default GroupDetails;







/* working as of 2/4/25 without fetching subscriber data when Group name is clicked
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./GroupDetails.css";
import axios from "axios";

const GroupDetails = ({ groupID }) => {
    const navigate = useNavigate();
    const [subscribers, setSubscribers] = useState([
        { id: 1, email: "john@example.com", firstName: "John", lastName: "Doe", phone: "123-456-7890", selected: false },
        { id: 2, email: "jane@example.com", firstName: "Jane", lastName: "Smith", phone: "987-654-3210", selected: false }
    ]);
    const [selectAll, setSelectAll] = useState(false);

    const handleCheckboxChange = (id) => {
        const updatedSubscribers = subscribers.map(subscriber =>
            subscriber.id === id ? { ...subscriber, selected: !subscriber.selected } : subscriber
        );
        setSubscribers(updatedSubscribers);
    };

    const handleSelectAll = () => {
        const newSelectAll = !selectAll;
        setSelectAll(newSelectAll);
        setSubscribers(subscribers.map(subscriber => ({ ...subscriber, selected: newSelectAll })));
    };

    return (
        <div className="group-details-container">
            <h2 className="group-id">{groupID}</h2>
            <div className="buttons-container">
                <button className="add-subscriber" onClick={() => alert("Add Subscriber Screen")}>Add Subscriber</button>
                {subscribers.some(subscriber => subscriber.selected) && (
                    <button className="delete-subscriber">Delete Subscriber</button>
                )}
                
                <button onClick={() => navigate(-1)} style={{ backgroundColor: "blue", color: "white" }}>
                    Cancel
                </button>
            </div>
            <table className="subscribers-table">
                <thead>
                    <tr>
                        <th><input type="checkbox" checked={selectAll} onChange={handleSelectAll} /></th>
                        <th>Email</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Phone</th>
                    </tr>
                </thead>
                <tbody>
                    {subscribers.map(subscriber => (
                        <tr key={subscriber.id}>
                            <td>
                                <input type="checkbox" checked={subscriber.selected} onChange={() => handleCheckboxChange(subscriber.id)} />
                            </td>
                            <td>{subscriber.email}</td>
                            <td>{subscriber.firstName}</td>
                            <td>{subscriber.lastName}</td>
                            <td>{subscriber.phone}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default GroupDetails; */
