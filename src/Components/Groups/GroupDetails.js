
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
//import { useParams } from "react-router-dom";
import "./GroupDetails.css";
import axios from "axios";

const GroupDetails = () => {
    const navigate = useNavigate();
    const [subscribers, setSubscribers] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    
    const { id: groupID } = useParams();  // Get groupID from URL

    const [showPopup, setShowPopup] = useState(false);
    const [newSubscriber, setNewSubscriber] = useState({
        email: '',
        firstName: '',
        lastName: '',
        phone: '',
    });
    const [errors, setErrors] = useState({});
    const validateSubscriber = () => {
        const errs = {};
        if (!/\S+@\S+\.\S+/.test(newSubscriber.email)) errs.email = "Invalid email";
        if (!/^[a-zA-Z]+$/.test(newSubscriber.firstName)) errs.firstName = "First name required";
        if (!/^[a-zA-Z]+$/.test(newSubscriber.lastName)) errs.lastName = "Last name required";
        if (!/^\+?\d{7,15}$/.test(newSubscriber.phone)) errs.phone = "Invalid phone";
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };
    


    useEffect(() => {


        if (!groupID) return; // Avoid making request if groupID is not available
    
        const fetchSubscribers = async () => {
            try {
                console.log("groupID at UI:", groupID);
                const response = await axios.get(`/api/get-subscribers/${groupID}`);
               //const response = axios.get(`http://localhost:5000/api/get-subscribers/${groupID}`)

    
                console.log("GroupDetails mount....");
                console.log("Fetched subscriber data:", response.data);


                // Extract and format the subscriber data from backend response
                const formattedSubscribers = response.data.subscribers.map((subscriber, index) => ({
                    id: index + 1, // Add a unique id for rendering (if real id not needed)
                    email: subscriber.email,
                    firstName: subscriber.firstName,
                    lastName: subscriber.lastName,
                    phone: subscriber.phone,
                    selected: false,
                }));
    
                setSubscribers(formattedSubscribers);
            } catch (error) {
                console.error("Error fetching subscribers from backend:", error);
            }
        };
    
        //fetchSubscribers();
        if (groupID) fetchSubscribers();
    }, [groupID]);
    

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

    const handleInputChange = (field, value) => {
        setNewSubscriber({ ...newSubscriber, [field]: value });
    };
    
    const handleAddSubscriber = async () => {
        if (!validateSubscriber()) return;
       
        try {
            const response = await axios.post(`/api/add-newsubscriber/${groupID}`, newSubscriber);
            if (response.status === 200) {
                setSubscribers([...subscribers, {
                    ...newSubscriber,
                    id: subscribers.length + 1,
                    selected: false
                }]);
                setShowPopup(false);
                setNewSubscriber({ email: '', firstName: '', lastName: '', phone: '' });
                setErrors({});
            }
        } catch (err) {
            console.error("Failed to add subscriber:", err);
        }
    };
    
    const handleDeleteSubscribers = async () => {
        const selectedEmails = subscribers
            .filter(subscriber => subscriber.selected)
            .map(subscriber => subscriber.email);
    
        if (selectedEmails.length === 0) return;
        

        try {
            const response = await axios.delete(`/api/delete-subscribers/${groupID}`, {
                data: { subscribers: selectedEmails },
            });
    
            console.log("Delete response:", response.data);
    
            // Remove deleted subscribers from UI
            setSubscribers(subscribers.filter(subscriber => !selectedEmails.includes(subscriber.email)));
            setSelectAll(false);
        } catch (error) {
            console.error("Failed to delete subscribers:", error);
        }
    };
    

    return (
        <div className="group-details-container">
            <h2 className="group-id">{groupID}</h2>
            <div className="buttons-container">
               
                <button className="add-subscriber" onClick={() => setShowPopup(true)}>Add Subscriber</button>

                {subscribers.some(subscriber => subscriber.selected) && (
                    
                    <button className="delete-subscriber" onClick={handleDeleteSubscribers}>Delete Subscriber</button>

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

        {showPopup && (
            <div className="popup-overlay">
                <div className="popup-box">
                    <h3>Add New Subscriber</h3>
                    <table className="subscribers-table">
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Phone</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <input
                                        type="email"
                                        value={newSubscriber.email}
                                        onChange={e => handleInputChange('email', e.target.value)}
                                    />
                                    {errors.email && <div className="error">{errors.email}</div>}
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={newSubscriber.firstName}
                                        onChange={e => handleInputChange('firstName', e.target.value)}
                                    />
                                    {errors.firstName && <div className="error">{errors.firstName}</div>}
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={newSubscriber.lastName}
                                        onChange={e => handleInputChange('lastName', e.target.value)}
                                    />
                                    {errors.lastName && <div className="error">{errors.lastName}</div>}
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={newSubscriber.phone}
                                        onChange={e => handleInputChange('phone', e.target.value)}
                                    />
                                    {errors.phone && <div className="error">{errors.phone}</div>}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="popup-buttons">
                        <button onClick={handleAddSubscriber} style={{ backgroundColor: "green", color: "white" }}>Add</button>
                        <button onClick={() => { setShowPopup(false); setErrors({}); }} style={{ backgroundColor: "grey", color: "white" }}>Cancel</button>
                    </div>
                </div>
            </div>
            )}

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
