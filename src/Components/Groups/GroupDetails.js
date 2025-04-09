import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './GroupDetails.css';
import axios from 'axios';

const GroupDetails = () => {
    const navigate = useNavigate();
    const [subscribers, setSubscribers] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const { id: groupID } = useParams();
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
        if (!/\S+@\S+\.\S+/.test(newSubscriber.email)) errs.email = 'Invalid email';
        if (!/^[a-zA-Z]+$/.test(newSubscriber.firstName)) errs.firstName = 'First name required';
        if (!/^[a-zA-Z]+$/.test(newSubscriber.lastName)) errs.lastName = 'Last name required';
        if (!/^\+?\d{7,15}$/.test(newSubscriber.phone)) errs.phone = 'Invalid phone';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    useEffect(() => {
        if (!groupID) return;

        const fetchSubscribers = async () => {
            try {
                const response = await axios.get(`/api/get-subscribers/${groupID}`);
                const formattedSubscribers = response.data.subscribers.map((subscriber, index) => ({
                    id: `${subscriber.email}-${index}`, // Unique ID using email
                    senderId: subscriber.id, 
                    email: subscriber.email,
                    firstName: subscriber.firstName,
                    lastName: subscriber.lastName,
                    phone: subscriber.phone,
                    selected: false,
                }));
                setSubscribers(formattedSubscribers);
            } catch (error) {
                console.error('Error fetching subscribers from backend:', error);
            }
        };

        fetchSubscribers();
    }, [groupID]);

    const handleCheckboxChange = (id) => {
        setSubscribers(prev =>
            prev.map(subscriber =>
                subscriber.id === id ? { ...subscriber, selected: !subscriber.selected } : subscriber
            )
        );
    };

    const handleSelectAll = () => {
        const newSelectAll = !selectAll;
        setSelectAll(newSelectAll);
        setSubscribers(prev => prev.map(subscriber => ({ ...subscriber, selected: newSelectAll })));
    };

    const handleInputChange = (field, value) => {
        setNewSubscriber(prev => ({ ...prev, [field]: value }));
    };

    const handleAddSubscriber = async () => {
        if (!validateSubscriber()) return;

        try {
            const response = await axios.post(`/api/add-newsubscriber/${groupID}`, newSubscriber);
            if (response.status === 200) {
                const newEntry = {
                    ...newSubscriber,
                    id: `${newSubscriber.email}-${Date.now()}`,
                    selected: false,
                };
                setSubscribers(prev => [...prev, newEntry]);
                setShowPopup(false);
                setNewSubscriber({ email: '', firstName: '', lastName: '', phone: '' });
                setErrors({});
            }
        } catch (err) {
            console.error('Failed to add subscriber:', err);
        }
    };

    const handleDeleteSubscribers = async () => {
        const selectedEmails = subscribers.filter(s => s.selected).map(s => s.email);
        if (selectedEmails.length === 0) return;

        try {
            const response = await axios.delete(`/api/delete-subscribers/${groupID}`, {
                data: { subscribers: selectedEmails },
            });
            setSubscribers(prev => prev.filter(s => !selectedEmails.includes(s.email)));
            setSelectAll(false);
        } catch (error) {
            console.error('Failed to delete subscribers:', error);
        }
    };

    return (
        <div className="group-details-container">
            <h2 className="group-id">{groupID}</h2>
            <div className="buttons-container">
                <button className="add-subscriber" onClick={() => setShowPopup(true)}>
                    Add Subscriber
                </button>

                {subscribers.some(s => s.selected) && (
                    <button className="delete-subscriber" onClick={handleDeleteSubscribers}>
                        Delete Subscriber
                    </button>
                )}

                <button onClick={() => navigate(-1)} style={{ backgroundColor: 'blue', color: 'white' }}>
                    Cancel
                </button>
            </div>

            <table className="subscribers-table">
                <thead>
                    <tr>
                        <th>
                            <input type="checkbox" checked={selectAll} onChange={handleSelectAll} />
                        </th>
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
                                <input
                                    type="checkbox"
                                    checked={subscriber.selected}
                                    onChange={() => handleCheckboxChange(subscriber.id)}
                                />
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
                            <button onClick={handleAddSubscriber} style={{ backgroundColor: 'green', color: 'white' }}>
                                Add
                            </button>
                            <button
                                onClick={() => {
                                    setShowPopup(false);
                                    setErrors({});
                                }}
                                style={{ backgroundColor: 'grey', color: 'white' }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GroupDetails;
